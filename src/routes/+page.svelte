<script>
	import { Hero, About, Services, Process, Portfolio, Reviews, FAQ, Contact } from '$lib';
	import { m } from '$lib/paraglide/messages.js';
	import { useQuery } from '@sanity/sveltekit';

	const { data } = $props();
	const reviewsResult = $derived(useQuery(data.reviews));
	const reviews = $derived($reviewsResult.data ?? []);
	const projectsResult = $derived(useQuery(data.projects));
	const projects = $derived($projectsResult.data ?? []);
</script>

<svelte:head>
	<title>devrec | Webdeveloper & Designer</title>
	<meta
		name="description"
		content="devrec, webdeveloper & designer gevestigd in Amsterdam. Websites die indruk maken. Resultaten die tellen."
	/>
	<meta property="og:title" content="devrec | Webdeveloper & Designer" />
	<meta
		property="og:description"
		content="devrec, webdeveloper & designer gevestigd in Amsterdam. Websites die indruk maken. Resultaten die tellen."
	/>
	<meta name="twitter:title" content="devrec | Webdeveloper & Designer" />
	<meta
		name="twitter:description"
		content="devrec, webdeveloper & designer gevestigd in Amsterdam. Websites die indruk maken. Resultaten die tellen."
	/>
</svelte:head>

<Hero />

<a href="/gratis-website-check" class="tool-cta-banner">
	<span class="tool-cta-badge">{m.tool_cta_badge()}</span>
	<span class="tool-cta-text">{m.tool_cta_text()}</span>
	<span class="tool-cta-arrow" aria-hidden="true">→</span>
</a>

<About />
<Services />
<Process />
<Portfolio {projects} />
<Reviews {reviews} />
<FAQ />
<Contact />

<style>
	.tool-cta-banner {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem clamp(1rem, 5vw, 2rem);
		background: var(--c-fg);
		color: var(--c-bg);
		text-decoration: none;
		font-size: 0.88rem;
		font-weight: 500;
		transition: opacity 0.15s;
		flex-wrap: wrap;
	}
	.tool-cta-banner:hover {
		opacity: 0.88;
	}

	.tool-cta-badge {
		display: inline-block;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		border: 1px solid rgba(255, 255, 255, 0.3);
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		white-space: nowrap;
		opacity: 0.8;
	}

	.tool-cta-text {
		flex: 1;
		min-width: 0;
	}

	.tool-cta-arrow {
		font-size: 1rem;
		margin-left: auto;
	}
</style>
