<script>
	import { m } from '$lib/paraglide/messages.js';

	const groups = [
		{
			label: () => m.sitemap_group_pages(),
			links: [
				{ label: 'Home', href: '/' },
				{ label: () => m.nav_about(), href: '/over-mij' },
				{ label: () => m.nav_portfolio(), href: '/portfolio' },
				{ label: () => m.nav_blog(), href: '/blog' },
				{ label: 'Gratis Website Check', href: '/gratis-website-check' }
			]
		},
		{
			label: () => m.sitemap_group_sections(),
			links: [
				{ label: () => m.nav_services(), href: '/#diensten' },
				{ label: () => m.nav_contact(), href: '/#contact' }
			]
		},
		{
			label: () => m.sitemap_group_legal(),
			links: [
				{ label: () => m.footer_privacy(), href: '/privacy' },
				{ label: () => m.footer_terms(), href: '/algemene-voorwaarden' }
			]
		}
	];
</script>

<svelte:head>
	<title>{m.sitemap_page_title()}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="sitemap-page">
	<div class="sitemap-inner">
		<a href="/" class="back-link">
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<line x1="19" y1="12" x2="5" y2="12" />
				<polyline points="12 19 5 12 12 5" />
			</svg>
			{m.sitemap_back()}
		</a>

		<header class="page-head">
			<h1 class="page-heading">{m.sitemap_heading()}</h1>
			<p class="page-sub">{m.sitemap_sub()}</p>
		</header>

		<div class="sitemap-grid">
			{#each groups as group}
				<section class="sitemap-group">
					<span class="group-label">{group.label()}</span>
					<ul class="link-list">
						{#each group.links as link}
							<li>
								<a href={link.href} class="site-link">
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"
									>
										<line x1="5" y1="12" x2="19" y2="12" />
										<polyline points="12 5 19 12 12 19" />
									</svg>
									{typeof link.label === 'function' ? link.label() : link.label}
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	</div>
</div>

<style>
	.sitemap-page {
		padding-top: clamp(6rem, 12vw, 10rem);
		padding-bottom: clamp(4rem, 6vw, 6rem);
		min-height: 60svh;
	}

	.sitemap-inner {
		max-width: 1120px;
		margin-inline: auto;
		padding-inline: clamp(1.25rem, 5vw, 2.5rem);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: var(--c-fg-muted);
		text-decoration: none;
		margin-bottom: 3rem;
		transition: color 0.15s ease;
	}

	.back-link:hover {
		color: var(--c-fg);
	}

	.page-head {
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}

	.page-heading {
		font-family: var(--font-heading);
		font-size: clamp(2.5rem, 7vw, 5rem);
		letter-spacing: -0.03em;
		line-height: 1.05;
		color: var(--c-fg);
		margin: 0 0 0.75rem;
	}

	.page-sub {
		font-size: clamp(0.9rem, 2vw, 1rem);
		color: var(--c-fg-muted);
		margin: 0;
	}

	.sitemap-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
		border-top: 1px solid var(--c-border-site);
		padding-top: 2.5rem;
	}

	.sitemap-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.group-label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
	}

	.link-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.site-link {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--c-fg-muted);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.site-link:hover {
		color: var(--c-fg);
	}

	@media (min-width: 640px) {
		.sitemap-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 3rem;
		}
	}
</style>
