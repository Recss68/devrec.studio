import { createHmac } from 'crypto';

/**
 * Validates a review submission token and code.
 * Returns { ok: true, payload } on success, or { error: string } on failure.
 */
export function validateToken(token, code, secret) {
	const dotIndex = (token ?? '').lastIndexOf('.');
	if (dotIndex === -1) return { error: 'Ongeldig token.' };

	const b64 = token.slice(0, dotIndex);
	const sig = token.slice(dotIndex + 1);

	let payloadStr;
	let payload;
	try {
		payloadStr = Buffer.from(b64, 'base64').toString('utf-8');
		payload = JSON.parse(payloadStr);
	} catch {
		return { error: 'Ongeldig token.' };
	}

	const expectedSig = createHmac('sha256', secret).update(payloadStr).digest('hex');
	if (sig !== expectedSig) return { error: 'Ongeldige verificatiecode.' };
	if (Date.now() > payload.exp) return { error: 'Code verlopen. Vraag een nieuwe code aan.' };
	if (payload.code !== code.trim()) return { error: 'Onjuiste code. Controleer je e-mail.' };

	return { ok: true, payload };
}

/** Returns the validated integer rating (1–5), or null if invalid. */
export function validateRating(rating) {
	const r = Number(rating);
	if (!Number.isInteger(r) || r < 1 || r > 5) return null;
	return r;
}

/** Builds a signed token for testing purposes. */
export function buildToken(payload, secret) {
	const payloadStr = JSON.stringify(payload);
	const sig = createHmac('sha256', secret).update(payloadStr).digest('hex');
	return Buffer.from(payloadStr).toString('base64') + '.' + sig;
}
