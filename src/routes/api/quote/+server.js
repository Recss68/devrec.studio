import { json, error } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { escapeHtml } from '$lib/server/email.js';

const attempts = new Map();
const MAX = 5;
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
	if (isRateLimited(getClientAddress())) {
		throw error(429, 'Te veel verzoeken. Probeer het later opnieuw.');
	}
	const body = await request.json().catch(() => null);
	const { service, company, website, need, budget, fullName, email, phone, wantsMeeting } =
		body ?? {};

	if (!service || !company?.trim() || !need?.trim() || !fullName?.trim() || !email?.trim()) {
		throw error(400, 'Verplichte velden ontbreken.');
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
		throw error(400, 'Ongeldig e-mailadres.');
	}

	const meetingLine =
		wantsMeeting === true
			? 'Ja, ingepland via Google Calendar'
			: wantsMeeting === false
				? 'Nee'
				: 'Niet aangegeven';

	const resend = new Resend(env.RESEND_API_KEY);

	const { error: resendError } = await resend.emails.send({
		from: env.RESEND_FROM,
		to: env.RESEND_TO,
		reply_to: email.trim(),
		subject: `Offerte aanvraag: ${service}`,
		html: `
			<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
				<h2 style="margin:0 0 24px;font-size:20px;">Nieuwe offerte aanvraag</h2>

				<h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#666;">Dienst</h3>
				<p style="margin:0 0 20px;font-size:15px;font-weight:600;">${escapeHtml(service)}</p>

				<h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#666;">Bedrijf</h3>
				<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;width:130px;color:#666;font-size:14px;">Bedrijfsnaam</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${escapeHtml(company.trim())}</td>
					</tr>
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:14px;">Website</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${website?.trim() ? escapeHtml(website.trim()) : '—'}</td>
					</tr>
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:14px;">Budget</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${budget ? escapeHtml(budget) : '—'}</td>
					</tr>
				</table>

				<h3 style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#666;">Wat hebben ze nodig</h3>
				<p style="margin:0 0 20px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(need.trim())}</p>

				<h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#666;">Contactgegevens</h3>
				<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;width:130px;color:#666;font-size:14px;">Naam</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${escapeHtml(fullName.trim())}</td>
					</tr>
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:14px;">E-mail</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${escapeHtml(email.trim())}</td>
					</tr>
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:14px;">Telefoon</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${phone?.trim() ? escapeHtml(phone.trim()) : '—'}</td>
					</tr>
				</table>

				<h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#666;">Kennismakingsgesprek</h3>
				<p style="margin:0 0 24px;font-size:14px;">${escapeHtml(meetingLine)}</p>

				<p style="margin:0;font-size:12px;color:#999;">Verzonden via devrec.nl</p>
			</div>
		`
	});

	if (resendError) {
		console.error('Resend error (quote):', resendError);
		throw error(500, 'Verzenden mislukt. Probeer het opnieuw.');
	}

	return json({ ok: true });
}
