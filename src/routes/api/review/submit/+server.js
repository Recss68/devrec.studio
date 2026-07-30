import { createHmac } from 'crypto';
import { createClient } from '@sanity/client';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dataset, projectId, apiVersion } from '$lib/sanity/api.js';

function getAmsterdamDate() {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Amsterdam',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(new Date());
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { token, code, authorName, rating, text } = await request.json();

	if (!token || !code || !authorName?.trim() || !rating || !text?.trim()) {
		return json({ error: 'Vul alle velden in.' }, { status: 400 });
	}

	const dotIndex = (token ?? '').lastIndexOf('.');
	if (dotIndex === -1) return json({ error: 'Ongeldig token.' }, { status: 400 });

	const b64 = token.slice(0, dotIndex);
	const sig = token.slice(dotIndex + 1);

	let payloadStr;
	let payload;
	try {
		payloadStr = Buffer.from(b64, 'base64').toString('utf-8');
		payload = JSON.parse(payloadStr);
	} catch {
		return json({ error: 'Ongeldig token.' }, { status: 400 });
	}

	const expectedSig = createHmac('sha256', env.REVIEW_CODE_SECRET).update(payloadStr).digest('hex');

	if (sig !== expectedSig) {
		return json({ error: 'Ongeldige verificatiecode.' }, { status: 400 });
	}
	if (Date.now() > payload.exp) {
		return json({ error: 'Code verlopen. Vraag een nieuwe code aan.' }, { status: 400 });
	}
	if (payload.code !== code.trim()) {
		return json({ error: 'Onjuiste code. Controleer je e-mail.' }, { status: 400 });
	}

	const client = createClient({
		projectId,
		dataset,
		apiVersion,
		token: env.SANITY_API_WRITE_TOKEN,
		useCdn: false
	});

	await client.create({
		_type: 'review',
		author_name: authorName.trim(),
		rating: Math.min(5, Math.max(1, Number(rating))),
		date: getAmsterdamDate(),
		text: text.trim()
	});

	return json({ ok: true });
}
