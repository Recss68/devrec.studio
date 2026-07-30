import { writable } from 'svelte/store';

export const quoteOpen = writable(false);
export const quoteService = writable('');

export function openQuote(service = '') {
	quoteService.set(service);
	quoteOpen.set(true);
}

export function closeQuote() {
	quoteOpen.set(false);
	quoteService.set('');
}
