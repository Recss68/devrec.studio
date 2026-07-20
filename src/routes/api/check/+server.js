import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const PSI_ERRORS = {
	INVALID_URL: 'De URL is ongeldig. Controleer of je een correcte website URL hebt ingevoerd (bijv. https://jouwsite.nl).',
	ERRORED_DOCUMENT_REQUEST: 'De website kon niet bereikt worden. Controleer of de URL correct en bereikbaar is.',
	FAILED_DOCUMENT_REQUEST: 'De website kon niet bereikt worden. Mogelijk is de site offline of blokkeert hij externe verzoeken.',
	BLOCKED: 'De website blokkeert externe analyse. Probeer een andere URL.',
	NOT_HTML: 'De URL verwijst niet naar een webpagina.'
};

export async function POST({ request }) {
	const body = await request.json().catch(() => null);
	let raw = (body?.url ?? '').trim();

	if (!raw) throw error(400, 'Geen URL opgegeven.');

	if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
		raw = 'https://' + raw;
	}

	let parsed;
	try {
		parsed = new URL(raw);
	} catch {
		throw error(400, 'De URL is ongeldig. Controleer of je een correcte website URL hebt ingevoerd.');
	}

	const key = env.PAGESPEED_API_KEY ? `&key=${env.PAGESPEED_API_KEY}` : '';
	const apiUrl =
		`https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
		`?url=${encodeURIComponent(parsed.href)}` +
		`&strategy=mobile` +
		`&locale=nl` +
		`&category=performance` +
		`&category=accessibility` +
		`&category=seo` +
		`&category=best-practices` +
		`&category=agentic-browsing` +
		key;

	let res;
	try {
		res = await fetch(apiUrl, { signal: AbortSignal.timeout(28000) });
	} catch {
		throw error(503, 'Analyse-service is tijdelijk niet bereikbaar. Probeer het opnieuw.');
	}

	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		const reason = data?.error?.errors?.[0]?.reason ?? '';
		const msg = PSI_ERRORS[reason] ?? data?.error?.message ?? 'Er ging iets mis tijdens de analyse.';
		throw error(res.status >= 500 ? 503 : 400, msg);
	}

	const data = await res.json();
	return json(data);
}
