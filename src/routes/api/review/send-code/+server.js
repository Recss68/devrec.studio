import { createHmac, randomBytes } from 'crypto';
import { Resend } from 'resend';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { verifyTurnstile } from '$lib/server/turnstile.js';

const attempts = new Map();
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip) {
	const now = Date.now();
	const entry = attempts.get(ip);
	if (!entry || now - entry.start > WINDOW_MS) {
		attempts.set(ip, { count: 1, start: now });
		return false;
	}
	if (entry.count >= MAX_ATTEMPTS) return true;
	entry.count++;
	return false;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, getClientAddress }) {
	const ip = getClientAddress();
	if (isRateLimited(ip)) {
		return json(
			{ error: 'Te veel pogingen. Probeer het over 15 minuten opnieuw.' },
			{ status: 429 }
		);
	}

	const { email, cfToken } = await request.json();

	if (!(await verifyTurnstile(cfToken, ip))) {
		return json({ error: 'Captcha verificatie mislukt. Probeer het opnieuw.' }, { status: 400 });
	}

	const trimmed = (email ?? '').trim().toLowerCase();
	if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
		return json({ error: 'Ongeldig e-mailadres.' }, { status: 400 });
	}

	const code = String(100000 + (randomBytes(3).readUIntBE(0, 3) % 900000));
	const exp = Date.now() + 15 * 60 * 1000;

	const payloadStr = JSON.stringify({ email: trimmed, code, exp });
	const sig = createHmac('sha256', env.REVIEW_CODE_SECRET).update(payloadStr).digest('hex');
	const token = Buffer.from(payloadStr).toString('base64') + '.' + sig;

	const resend = new Resend(env.RESEND_API_KEY);
	const { error: mailErr } = await resend.emails.send({
		from: env.RESEND_FROM,
		to: trimmed,
		subject: 'Jouw verificatiecode – devrec review',
		html: `
			<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:2rem;color:#111">
				<p style="margin:0 0 1rem">Bedankt dat je een review wilt plaatsen bij devrec!</p>
				<p style="margin:0 0 1.5rem;color:#555">Gebruik de onderstaande code om je review te bevestigen. De code is <strong>15 minuten</strong> geldig.</p>
				<div style="font-size:2.5rem;font-weight:700;letter-spacing:0.3em;padding:1.5rem 2rem;background:#f5f5f5;border-radius:8px;display:inline-block;margin-bottom:1.5rem">${code}</div>
				<p style="color:#999;font-size:0.85rem;margin:0">Heb je geen review aangevraagd? Dan kun je deze e-mail negeren.</p>
			</div>
		`
	});

	if (mailErr) return json({ error: 'Verzenden mislukt. Probeer het opnieuw.' }, { status: 500 });

	return json({ token });
}
