<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/theme.css';
	import { Header, Footer } from '$lib';
	import CookieConsent from '$lib/components/CookieConsent.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="devrec — webdeveloper & designer. Websites die indruk maken. Resultaten die tellen."
	/>
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
