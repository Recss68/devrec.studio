import { describe, it, expect } from 'vitest';
import { validateToken, validateRating, buildToken } from './review-token.js';

const SECRET = 'test-secret';

function makeToken(overrides = {}) {
	const payload = {
		email: 'test@example.com',
		code: '123456',
		exp: Date.now() + 60_000,
		...overrides
	};
	return { token: buildToken(payload, SECRET), code: payload.code };
}

// ── validateRating ────────────────────────────────────────────────────────────

describe('validateRating', () => {
	it('accepts integers 1 through 5', () => {
		expect(validateRating(1)).toBe(1);
		expect(validateRating(3)).toBe(3);
		expect(validateRating(5)).toBe(5);
	});

	it('rejects 0 and 6', () => {
		expect(validateRating(0)).toBeNull();
		expect(validateRating(6)).toBeNull();
	});

	it('rejects floats', () => {
		expect(validateRating(4.5)).toBeNull();
	});

	it('rejects strings that are not numbers', () => {
		expect(validateRating('abc')).toBeNull();
	});

	it('rejects NaN and Infinity', () => {
		expect(validateRating(NaN)).toBeNull();
		expect(validateRating(Infinity)).toBeNull();
	});
});

// ── validateToken ─────────────────────────────────────────────────────────────

describe('validateToken', () => {
	it('accepts a valid token and code', () => {
		const { token, code } = makeToken();
		expect(validateToken(token, code, SECRET)).toEqual(
			expect.objectContaining({ ok: true })
		);
	});

	it('rejects a tampered signature', () => {
		const { token, code } = makeToken();
		const tampered = token.slice(0, -4) + 'xxxx';
		expect(validateToken(tampered, code, SECRET)).toEqual({ error: 'Ongeldige verificatiecode.' });
	});

	it('rejects a wrong secret', () => {
		const { token, code } = makeToken();
		expect(validateToken(token, code, 'wrong-secret')).toEqual({
			error: 'Ongeldige verificatiecode.'
		});
	});

	it('rejects an expired token', () => {
		const { token, code } = makeToken({ exp: Date.now() - 1000 });
		expect(validateToken(token, code, SECRET)).toEqual({
			error: 'Code verlopen. Vraag een nieuwe code aan.'
		});
	});

	it('rejects a wrong code', () => {
		const { token } = makeToken({ code: '123456' });
		expect(validateToken(token, '999999', SECRET)).toEqual({
			error: 'Onjuiste code. Controleer je e-mail.'
		});
	});

	it('rejects a token without a dot separator', () => {
		expect(validateToken('nodothere', '123456', SECRET)).toEqual({ error: 'Ongeldig token.' });
	});

	it('rejects a token with invalid base64 payload', () => {
		expect(validateToken('!!!.somesig', '123456', SECRET)).toEqual({ error: 'Ongeldig token.' });
	});
});
