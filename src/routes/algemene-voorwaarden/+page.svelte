<svelte:head>
	<title>Algemene Voorwaarden | devrec</title>
	<meta name="description" content="Algemene voorwaarden van devrec: de afspraken die gelden bij samenwerking." />
	<meta property="og:title" content="Algemene Voorwaarden | devrec" />
	<meta property="og:description" content="Algemene voorwaarden van devrec: de afspraken die gelden bij samenwerking." />
	<meta name="twitter:title" content="Algemene Voorwaarden | devrec" />
	<meta name="twitter:description" content="Algemene voorwaarden van devrec: de afspraken die gelden bij samenwerking." />
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="legal-section">
	<div class="legal-inner">
		<a href="/" class="back-link">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<line x1="19" y1="12" x2="5" y2="12" />
				<polyline points="12 19 5 12 12 5" />
			</svg>
			Terug naar home
		</a>

		<h1>Algemene Voorwaarden</h1>
		<p class="last-updated">Laatste update: juli 2026</p>

		<div class="legal-content">
			<h2>1. Definities</h2>
			<p>Opdrachtnemer: devrec, gevestigd te Amsterdam. Opdrachtgever: de natuurlijke of rechtspersoon die een overeenkomst sluit met devrec.</p>

			<h2>2. Toepasselijkheid</h2>
			<p>Deze algemene voorwaarden zijn van toepassing op alle offertes en overeenkomsten tussen devrec en opdrachtgever.</p>

			<h2>3. Offertes en overeenkomsten</h2>
			<p>Offertes zijn 30 dagen geldig. Een overeenkomst komt tot stand na schriftelijke bevestiging door beide partijen.</p>

			<h2>4. Betaling</h2>
			<p>Facturering vindt plaats na oplevering, tenzij anders overeengekomen. Betaling dient te geschieden binnen 14 dagen na factuurdatum.</p>

			<h2>5. Intellectueel eigendom</h2>
			<p>Na volledige betaling gaan alle rechten op het opgeleverde werk over naar de opdrachtgever. devrec behoudt het recht om het werk te tonen als referentie.</p>

			<h2>6. Aansprakelijkheid</h2>
			<p>devrec is niet aansprakelijk voor indirecte schade. De aansprakelijkheid is beperkt tot het factuurbedrag van de betreffende opdracht.</p>

			<h2>7. Toepasselijk recht</h2>
			<p>Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechtbank in Amsterdam.</p>
		</div>
	</div>
</section>

<style>
	.legal-section {
		padding-block: clamp(6rem, 10vw, 8rem);
	}

	.legal-inner {
		max-width: 720px;
		margin-inline: auto;
		padding-inline: clamp(1rem, 4vw, 2rem);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		color: var(--c-fg-muted);
		margin-bottom: 2.5rem;
		transition: color 0.15s ease;
	}

	.back-link:hover {
		color: var(--c-fg);
	}

	h1 {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 6vw, 3.5rem);
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0 0 0.5rem 0;
		line-height: 1.1;
	}

	.last-updated {
		font-size: 0.85rem;
		color: var(--c-fg-muted);
		margin: 0 0 3rem 0;
	}

	.legal-content h2 {
		font-family: var(--font-heading);
		font-size: clamp(1rem, 2.5vw, 1.25rem);
		letter-spacing: -0.01em;
		color: var(--c-fg);
		margin: 2.5rem 0 0.75rem 0;
		line-height: 1.3;
	}

	.legal-content h2:first-child {
		margin-top: 0;
	}

	.legal-content p {
		font-size: 0.95rem;
		line-height: 1.75;
		color: var(--c-fg-muted);
		margin: 0;
	}

	.legal-content a {
		color: var(--c-fg);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.legal-content a:hover {
		color: var(--c-fg-muted);
	}
</style>
