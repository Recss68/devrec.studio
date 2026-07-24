import { json, error } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	const body = await request.json().catch(() => null);
	const { name, email, message } = body ?? {};

	if (!name?.trim() || !email?.trim() || !message?.trim()) {
		throw error(400, 'Alle velden zijn verplicht.');
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
		throw error(400, 'Ongeldig e-mailadres.');
	}

	const resend = new Resend(env.RESEND_API_KEY);

	const { error: resendError } = await resend.emails.send({
		from: env.RESEND_FROM,
		to: env.RESEND_TO,
		reply_to: email.trim(),
		subject: `Nieuw bericht van ${name.trim()}`,
		html: `
			<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111;">
				<h2 style="margin:0 0 24px;font-size:20px;">Nieuw contactbericht</h2>
				<table style="width:100%;border-collapse:collapse;">
					<tr>
						<td style="padding:10px 0;border-bottom:1px solid #eee;width:120px;color:#666;font-size:14px;">Naam</td>
						<td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${name.trim()}</td>
					</tr>
					<tr>
						<td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;font-size:14px;">E-mail</td>
						<td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;">${email.trim()}</td>
					</tr>
					<tr>
						<td style="padding:10px 16px 10px 0;color:#666;font-size:14px;vertical-align:top;">Bericht</td>
						<td style="padding:10px 0;font-size:14px;white-space:pre-wrap;">${message.trim()}</td>
					</tr>
				</table>
				<p style="margin:24px 0 0;font-size:12px;color:#999;">Verzonden via devrec.nl</p>
			</div>
		`
	});

	if (resendError) {
		console.error('Resend error (contact):', resendError);
		throw error(500, 'Verzenden mislukt. Probeer het opnieuw.');
	}

	return json({ ok: true });
}
