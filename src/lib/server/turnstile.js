import { env } from '$env/dynamic/private';

export async function verifyTurnstile(token, ip) {
	if (!token) return false;
	try {
		const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				secret: env.TURNSTILE_SECRET_KEY,
				response: token,
				remoteip: ip
			})
		});
		if (!res.ok) return false;
		const data = await res.json();
		return data.success === true;
	} catch {
		return false;
	}
}
