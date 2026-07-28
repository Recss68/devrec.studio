<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/theme.css';
	import { Header, Footer, QuoteModal } from '$lib';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { page } from '$app/state';
	import { PreviewMode, QueryLoader, VisualEditing } from '@sanity/sveltekit';
	import { client } from '$lib/sanity/client';

	// svelte-ignore state_referenced_locally
	const { children, data } = $props();
	const { previewEnabled } = data;

	const siteName = 'devrec';
	const ogImage = 'https://devrec.nl/og-image.png';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="canonical" href={page.url.href} />

	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="nl_NL" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<PreviewMode enabled={previewEnabled}>
	<VisualEditing enabled={previewEnabled}>
		<QueryLoader enabled={previewEnabled} {client}>
			<Header />
			<main>
				{@render children()}
			</main>
			<Footer />
			<CookieConsent />
			<QuoteModal />
		</QueryLoader>
	</VisualEditing>
</PreviewMode>

<style>
	main {
		width: 100%;
	}
</style>
