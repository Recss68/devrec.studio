<svelte:head>
	<title>Privacyverklaring | devrec</title>
	<meta name="description" content="Privacyverklaring van devrec: hoe wij omgaan met jouw persoonsgegevens." />
	<meta property="og:title" content="Privacyverklaring | devrec" />
	<meta property="og:description" content="Privacyverklaring van devrec: hoe wij omgaan met jouw persoonsgegevens." />
	<meta name="twitter:title" content="Privacyverklaring | devrec" />
	<meta name="twitter:description" content="Privacyverklaring van devrec: hoe wij omgaan met jouw persoonsgegevens." />
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

		<h1>Privacyverklaring</h1>
		<p class="last-updated">Laatste update: juli 2026</p>

		<div class="legal-content">
			<h2>1. Wie zijn wij?</h2>
			<p>
				DevRec is een eenmanszaak gevestigd in Amsterdam.<br />
				KVK-nummer: 90301447<br />
				E-mail: <a href="mailto:info@devrec.nl">info@devrec.nl</a><br />
				Telefoon: <a href="tel:+31643859686">+31 6 43 85 96 86</a>
			</p>

			<h2>2. Welke gegevens verzamelen wij?</h2>
			<p>Wanneer je het contactformulier invult, ontvangen wij je naam, e-mailadres en het bericht dat je stuurt. Deze gegevens worden niet opgeslagen in een database; ze komen rechtstreeks als e-mail bij ons binnen. We verzamelen geen andere persoonsgegevens tenzij je deze zelf verstrekt.</p>

			<h2>3. Waarom verwerken wij deze gegevens?</h2>
			<p>Wij gebruiken jouw gegevens uitsluitend om te reageren op jouw vraag of opdracht. We sturen geen nieuwsbrieven en gebruiken je gegevens niet voor marketingdoeleinden.</p>

			<h2>4. Cookies</h2>
			<p>Onze website maakt gebruik van functionele cookies om je cookievoorkeur te onthouden. We gebruiken geen tracking- of analytische cookies en delen geen gegevens met advertentienetwerken.</p>

			<h2>5. Gegevens delen met derden</h2>
			<p>Wij verkopen of verstrekken je persoonsgegevens niet aan derden, tenzij dit noodzakelijk is voor de uitvoering van een opdracht of wettelijk verplicht is.</p>

			<h2>6. Jouw rechten</h2>
			<p>Je hebt het recht om je gegevens in te zien, te corrigeren of te laten verwijderen. Stuur hiervoor een e-mail naar <a href="mailto:info@devrec.nl">info@devrec.nl</a>. We reageren binnen een maand.</p>

			<h2>7. Contact</h2>
			<p>Vragen over deze privacyverklaring? Neem contact op via <a href="mailto:info@devrec.nl">info@devrec.nl</a> of <a href="tel:+31643859686">+31 6 43 85 96 86</a>.</p>
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
