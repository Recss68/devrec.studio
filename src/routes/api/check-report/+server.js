import { json, error } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { escapeHtml } from '$lib/server/email.js';
import { verifyTurnstile } from '$lib/server/turnstile.js';

const attempts = new Map();
const MAX = 3;
const WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip) {
	const now = Date.now();
	const entry = attempts.get(ip);
	if (!entry || now - entry.start > WINDOW_MS) {
		attempts.set(ip, { count: 1, start: now });
		return false;
	}
	if (entry.count >= MAX) return true;
	entry.count++;
	return false;
}

export async function POST({ request, getClientAddress }) {
	const ip = getClientAddress();
	if (isRateLimited(ip)) {
		throw error(429, 'Te veel verzoeken. Probeer het later opnieuw.');
	}

	const body = await request.json().catch(() => null);
	const { url, email, cfToken } = body ?? {};

	if (!(await verifyTurnstile(cfToken, ip))) {
		throw error(400, 'Captcha verificatie mislukt. Probeer het opnieuw.');
	}

	if (!url?.trim() || !email?.trim()) {
		throw error(400, 'URL en e-mailadres zijn verplicht.');
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
		throw error(400, 'Ongeldig e-mailadres.');
	}

	const resend = new Resend(env.RESEND_API_KEY);

	const { error: resendError } = await resend.emails.send({
		from: env.RESEND_FROM,
		to: env.RESEND_TO,
		reply_to: email.trim(),
		subject: `Gratis website check aanvraag: ${url.trim()}`,
		html: `
			<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111;">
				<h2 style="margin:0 0 24px;font-size:20px;">Gratis website check aanvraag</h2>
				<table style="width:100%;border-collapse:collapse;">
					<tr>
						<td style="padding:10px 0;border-bottom:1px solid #eee;width:100px;color:#666;font-size:14px;">Website</td>
						<td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${escapeHtml(url.trim())}</td>
					</tr>
					<tr>
						<td style="padding:10px 0;color:#666;font-size:14px;">E-mail</td>
						<td style="padding:10px 0;font-size:14px;">${escapeHtml(email.trim())}</td>
					</tr>
				</table>
				<p style="margin:24px 0 0;font-size:12px;color:#999;">Verzonden via devrec.nl/gratis-website-check</p>
			</div>
		`
	});

	if (resendError) {
		console.error('Resend error (check-report):', resendError);
		throw error(500, 'Verzenden mislukt. Probeer het opnieuw.');
	}

	return json({ ok: true });
}
