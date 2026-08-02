<script>
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';

	const is404 = $derived(page.status === 404);
	const heading = $derived(is404 ? m.error_404_heading() : m.error_generic_heading());
	const sub = $derived(is404 ? m.error_404_sub() : m.error_generic_sub());
</script>

<svelte:head>
	<title>{page.status} — devrec</title>
</svelte:head>

<div class="error-page">
	<div class="error-gradient" aria-hidden="true"></div>

	<div class="error-inner">
		<span class="error-code" aria-hidden="true">{page.status}</span>
		<h1 class="error-heading">{heading}</h1>
		<p class="error-sub">{sub}</p>
		<a href="/" class="btn">{m.error_back_home()}</a>
	</div>
</div>

<style>
	.error-page {
		position: relative;
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: var(--hero-bg);
		transition: background 0.2s ease;
	}

	.error-gradient {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--hero-gradient-opacity);
		transition: opacity 0.2s ease;
		background:
			radial-gradient(ellipse 80% 60% at 10% 90%, hsla(272, 80%, 52%, 0.5) 0%, transparent 55%),
			radial-gradient(ellipse 70% 55% at 90% 85%, hsla(260, 78%, 48%, 0.45) 0%, transparent 55%);
	}

	.error-inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: clamp(2rem, 8vw, 5rem) clamp(1.25rem, 5vw, 2.5rem);
		max-width: 640px;
		width: 100%;
	}

	.error-code {
		font-family: var(--font-heading);
		font-size: clamp(6rem, 20vw, 14rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.05em;
		color: var(--hero-text);
		opacity: 0.08;
		display: block;
		margin-bottom: -0.15em;
		transition: color 0.2s ease;
		user-select: none;
	}

	.error-heading {
		font-family: var(--font-heading);
		font-size: clamp(1.75rem, 5vw, 3rem);
		line-height: 1.1;
		letter-spacing: -0.03em;
		color: var(--hero-text);
		margin: 0 0 1rem 0;
		transition: color 0.2s ease;
	}

	.error-sub {
		font-size: clamp(0.95rem, 2vw, 1.1rem);
		color: var(--hero-text-muted);
		line-height: 1.65;
		margin: 0 0 2.5rem 0;
		max-width: 420px;
		transition: color 0.2s ease;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		font-family: var(--font-body);
		letter-spacing: 0.01em;
		border-radius: 6px;
		background: var(--hero-btn-primary-bg);
		color: var(--hero-btn-primary-text);
		border: 1px solid var(--hero-btn-primary-bg);
		transition: opacity 0.15s ease;
		white-space: nowrap;
	}

	.btn:hover {
		opacity: 0.85;
	}
</style>
