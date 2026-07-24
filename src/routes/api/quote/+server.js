import { json, error } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
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
			? 'Ja — ingepland via Google Calendar'
			: wantsMeeting === false
				? 'Nee'
				: 'Niet aangegeven';

	const resend = new Resend(env.RESEND_API_KEY);

	const { error: resendError } = await resend.emails.send({
		from: env.RESEND_FROM,
		to: env.RESEND_TO,
		reply_to: email.trim(),
		subject: `Offerte aanvraag — ${service}`,
		html: `
			<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
				<h2 style="margin:0 0 24px;font-size:20px;">Nieuwe offerte aanvraag</h2>

				<h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#666;">Dienst</h3>
				<p style="margin:0 0 20px;font-size:15px;font-weight:600;">${service}</p>

				<h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#666;">Bedrijf</h3>
				<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;width:130px;color:#666;font-size:14px;">Bedrijfsnaam</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${company.trim()}</td>
					</tr>
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:14px;">Website</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${website?.trim() || '—'}</td>
					</tr>
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:14px;">Budget</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${budget || '—'}</td>
					</tr>
				</table>

				<h3 style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#666;">Wat hebben ze nodig</h3>
				<p style="margin:0 0 20px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${need.trim()}</p>

				<h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#666;">Contactgegevens</h3>
				<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;width:130px;color:#666;font-size:14px;">Naam</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${fullName.trim()}</td>
					</tr>
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:14px;">E-mail</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${email.trim()}</td>
					</tr>
					<tr>
						<td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;font-size:14px;">Telefoon</td>
						<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">${phone?.trim() || '—'}</td>
					</tr>
				</table>

				<h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#666;">Kennismakingsgesprek</h3>
				<p style="margin:0 0 24px;font-size:14px;">${meetingLine}</p>

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
