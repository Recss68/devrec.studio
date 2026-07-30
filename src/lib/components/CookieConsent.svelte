<script>
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';

	let visible = $state(false);

	onMount(() => {
		const consent = localStorage.getItem('devrec-cookie-consent');
		if (!consent) {
			setTimeout(() => (visible = true), 800);
		}
	});

	function accept() {
		localStorage.setItem('devrec-cookie-consent', 'accepted');
		visible = false;
	}

	function deny() {
		localStorage.setItem('devrec-cookie-consent', 'denied');
		visible = false;
	}
</script>

{#if visible}
	<div class="cookie-popup" role="dialog" aria-label="Cookie toestemming" aria-live="polite">
		<p class="cookie-title">{m.cookie_title()}</p>
		<p class="cookie-text">{m.cookie_text()}</p>
		<div class="cookie-actions">
			<button class="btn-deny" onclick={deny}>{m.cookie_deny()}</button>
			<button class="btn-accept" onclick={accept}>{m.cookie_accept()}</button>
		</div>
	</div>
{/if}

<style>
	.cookie-popup {
		position: fixed;
		bottom: 1.25rem;
		right: 1.25rem;
		z-index: 200;
		background: var(--c-fg);
		color: var(--c-accent-inv);
		border-radius: 10px;
		padding: 1.25rem 1.5rem;
		max-width: 320px;
		width: calc(100vw - 2.5rem);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
		animation: slide-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
	}

	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.cookie-title {
		font-family: var(--font-heading);
		font-size: 0.95rem;
		font-weight: 600;
		margin: 0 0 0.4rem 0;
		color: inherit;
	}

	.cookie-text {
		font-size: 0.8rem;
		line-height: 1.5;
		margin: 0 0 1rem 0;
		opacity: 0.7;
		color: inherit;
	}

	.cookie-actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn-deny,
	.btn-accept {
		flex: 1;
		padding: 0.5rem 0.75rem;
		font-size: 0.8rem;
		font-weight: 600;
		border-radius: 6px;
		cursor: pointer;
		border: 1px solid transparent;
		font-family: var(--font-body);
		transition: opacity 0.15s ease;
	}

	.btn-deny {
		background: transparent;
		color: inherit;
		border-color: rgba(128, 128, 128, 0.4);
	}

	.btn-deny:hover {
		opacity: 0.7;
	}

	.btn-accept {
		background: var(--c-accent-inv);
		color: var(--c-fg);
	}

	.btn-accept:hover {
		opacity: 0.85;
	}

	@media (min-width: 640px) {
		.cookie-popup {
			width: 320px;
		}
	}
</style>
