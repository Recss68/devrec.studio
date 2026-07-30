<script>
	import { onMount } from 'svelte';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

	let { onVerify, onExpire = () => {}, onError = () => {} } = $props();

	let container = $state(null);
	let widgetId = $state(null);

	export function reset() {
		if (widgetId !== null && window.turnstile) {
			window.turnstile.reset(widgetId);
		}
	}

	onMount(() => {
		const render = () => {
			if (!container || !PUBLIC_TURNSTILE_SITE_KEY) return;
			widgetId = window.turnstile.render(container, {
				sitekey: PUBLIC_TURNSTILE_SITE_KEY,
				callback: onVerify,
				'expired-callback': onExpire,
				'error-callback': onError,
				theme: 'auto'
			});
		};

		if (window.turnstile) {
			render();
		} else if (document.getElementById('cf-turnstile-script')) {
			const iv = setInterval(() => {
				if (window.turnstile) {
					clearInterval(iv);
					render();
				}
			}, 50);
			return () => clearInterval(iv);
		} else {
			const script = document.createElement('script');
			script.id = 'cf-turnstile-script';
			script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
			script.async = true;
			script.defer = true;
			script.onload = render;
			document.head.appendChild(script);
		}

		return () => {
			if (widgetId !== null && window.turnstile) {
				window.turnstile.remove(widgetId);
			}
		};
	});
</script>

<div bind:this={container} class="turnstile-widget"></div>

<style>
	.turnstile-widget {
		margin-top: 0.5rem;
	}
</style>
