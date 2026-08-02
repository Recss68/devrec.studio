import { describe, it, expect } from 'vitest';
import { escapeHtml } from './email.js';

describe('escapeHtml', () => {
	it('escapes < and >', () => {
		expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
	});

	it('escapes &', () => {
		expect(escapeHtml('AT&T')).toBe('AT&amp;T');
	});

	it('escapes double quotes', () => {
		expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
	});

	it('escapes single quotes', () => {
		expect(escapeHtml("it's")).toBe('it&#x27;s');
	});

	it('escapes a full XSS payload', () => {
		const input = '<img src=x onerror="alert(\'xss\')">';
		expect(escapeHtml(input)).not.toContain('<');
		expect(escapeHtml(input)).not.toContain('>');
		expect(escapeHtml(input)).not.toContain('"');
	});

	it('leaves safe text unchanged', () => {
		expect(escapeHtml('Hallo wereld 123')).toBe('Hallo wereld 123');
	});

	it('coerces non-strings to string', () => {
		expect(escapeHtml(42)).toBe('42');
	});
});
