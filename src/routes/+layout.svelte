<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/theme.css';
	import { Header, Footer } from '$lib';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	const siteName = 'devrec';
	const ogImage = 'https://devrec.studio/og-image.png';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="canonical" href={page.url.href} />

	<!-- Open Graph (structureel — titels/descriptions staan per pagina) -->
	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="nl_NL" />

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<Header />
<main>
	{@render children()}
</main>
<Footer />
<CookieConsent />

<style>
	main {
		width: 100%;
	}
</style>
