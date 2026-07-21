<script>
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';

	const year = new Date().getFullYear();
	let localTime = $state('');

	onMount(() => {
		const update = () => {
			localTime = new Intl.DateTimeFormat('nl-NL', {
				hour: '2-digit',
				minute: '2-digit',
				timeZone: 'Europe/Amsterdam',
				hour12: false
			}).format(new Date());
		};
		update();
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	});

	const navLinks = [
		{ key: 'nav_about', href: '#over-mij' },
		{ key: 'nav_services', href: '#diensten' },
		{ key: 'nav_portfolio', href: '#portfolio' },
		{ key: 'nav_contact', href: '#contact' }
	];
</script>

<footer>
	<div class="footer-inner">
		<div class="footer-top">
			<div class="footer-brand">
				<a href="/" class="footer-logo" aria-label="devrec home">
					devrec<span class="logo-dot">.</span>
				</a>
				<p class="footer-tagline">{m.footer_tagline()}</p>
			</div>

			<div class="footer-location">
				<div class="location-now">
					<span class="now-dot" aria-hidden="true"></span>
					<span class="now-label">NOW</span>
				</div>
				<p class="location-city">{m.footer_location()}</p>
				<p class="location-time">
					{localTime || '00:00:00'} · {m.footer_local_time()}
				</p>
			</div>
		</div>

		<div class="footer-bottom">
			<nav class="footer-nav" aria-label="Footer navigatie">
				{#each navLinks as link}
					<a href={link.href} class="footer-link">
						{link.key === 'nav_about'
							? m.nav_about()
							: link.key === 'nav_services'
								? m.nav_services()
								: link.key === 'nav_portfolio'
									? m.nav_portfolio()
									: m.nav_contact()}
					</a>
				{/each}
			</nav>

			<div class="footer-legal-row">
				<a href="/privacy" class="footer-link">{m.footer_privacy()}</a>
				<a href="/algemene-voorwaarden" class="footer-link">{m.footer_terms()}</a>
				<p class="copyright">&copy; {year} devrec · {m.footer_rights()}</p>
			</div>
		</div>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--c-border-site);
		background: var(--c-bg);
	}

	.footer-inner {
		max-width: 1280px;
		margin-inline: auto;
		padding: 3rem clamp(1rem, 4vw, 2rem);
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.footer-top {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.footer-logo {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		letter-spacing: -0.02em;
		color: var(--c-fg);
		line-height: 1;
	}

	.logo-dot {
		color: var(--c-fg-muted);
	}

	.footer-tagline {
		font-size: 0.875rem;
		color: var(--c-fg-muted);
		margin: 0;
	}

	.footer-location {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.location-now {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.now-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #4ade80;
		flex-shrink: 0;
		box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.25);
	}

	.now-label {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--c-fg-muted);
		text-transform: uppercase;
	}

	.location-city {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 4vw, 2rem);
		letter-spacing: -0.01em;
		color: var(--c-fg);
		margin: 0;
		line-height: 1.1;
	}

	.location-time {
		font-size: 0.85rem;
		color: var(--c-fg-muted);
		margin: 0;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.02em;
	}

	.footer-bottom {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: flex-start;
		border-top: 1px solid var(--c-border-site);
		padding-top: 2rem;
	}

	.footer-legal-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 1.5rem;
	}

	.footer-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.footer-link {
		font-size: 0.875rem;
		color: var(--c-fg-muted);
		transition: color 0.15s ease;
	}

	.footer-link:hover {
		color: var(--c-fg);
	}

	.copyright {
		font-size: 0.8rem;
		color: var(--c-fg-muted);
		margin: 0;
	}

	@media (min-width: 640px) {
		.footer-bottom {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	@media (min-width: 768px) {
		.footer-inner {
			padding-block: 4rem;
		}

		.footer-top {
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-end;
		}

		.footer-location {
			text-align: right;
		}

		.location-now {
			justify-content: flex-end;
		}
	}
</style>
