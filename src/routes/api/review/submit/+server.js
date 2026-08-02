import { createClient } from '@sanity/client';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dataset, projectId, apiVersion } from '$lib/sanity/api.js';
import { validateToken, validateRating } from '$lib/server/review-token.js';

// Permanent block — no expiry. One review per IP for the lifetime of this server process.
const submitted = new Set();

function getAmsterdamDate() {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Amsterdam',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(new Date());
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, getClientAddress }) {
	const ip = getClientAddress();
	if (submitted.has(ip)) {
		return json({ error: 'Je hebt al een review geplaatst.' }, { status: 429 });
	}

	const { token, code, authorName, rating, text } = await request.json();

	if (!token || !code || !authorName?.trim() || !rating || !text?.trim()) {
		return json({ error: 'Vul alle velden in.' }, { status: 400 });
	}

	const r = validateRating(rating);
	if (r === null) {
		return json({ error: 'Ongeldig cijfer.' }, { status: 400 });
	}

	const result = validateToken(token, code, env.REVIEW_CODE_SECRET);
	if (!result.ok) {
		return json({ error: result.error }, { status: 400 });
	}
	const { payload } = result;

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
		rating: r,
		date: getAmsterdamDate(),
		text: text.trim()
	});

	submitted.add(ip);
	return json({ ok: true });
}
