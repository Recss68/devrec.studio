<script>
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import { useQuery } from '@sanity/sveltekit';
	import { urlFor } from '$lib/sanity/image.js';

	const { data } = $props();
	const result = $derived(useQuery(data));
	const projects = $derived($result.data ?? []);

	let locale = $state('nl');
	$effect(() => {
		try { locale = getLocale(); } catch { locale = 'nl'; }
	});
</script>

<svelte:head>
	<title>{m.portfolio_page_title()}</title>
	<meta name="description" content={m.portfolio_page_meta()} />
	<meta property="og:title" content={m.portfolio_page_title()} />
	<meta property="og:description" content={m.portfolio_page_meta()} />
	<meta name="twitter:title" content={m.portfolio_page_title()} />
	<meta name="twitter:description" content={m.portfolio_page_meta()} />
</svelte:head>

<div class="portfolio-page section">
	<div class="section-inner">

		<a href="/" class="back-link">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<line x1="19" y1="12" x2="5" y2="12"/>
				<polyline points="12 19 5 12 12 5"/>
			</svg>
			{m.portfolio_back()}
		</a>

		<div class="page-head">
			<span class="section-label">{m.portfolio_label()}</span>
			<h1 class="page-h1">{m.portfolio_page_heading()}</h1>
			<p class="page-sub">{m.portfolio_page_sub()}</p>
		</div>

		<div class="portfolio-grid">
			{#each projects as project (project._id)}
				<article class="project-card">
					<div class="card-image">
						{#if project.image}
							<img src={urlFor(project.image).width(800).url()} alt={project.title} loading="lazy" />
						{:else}
							<div class="card-placeholder" aria-hidden="true">
								<span class="placeholder-label">{project.title}</span>
							</div>
						{/if}
					</div>

					<div class="card-body">
						<div class="card-top">
							<span class="card-year">{project.year}</span>
							<a
								href={project.url ?? '#'}
								class="card-link"
								aria-label="{project.title} {m.portfolio_view()}"
								target={project.url ? '_blank' : undefined}
								rel={project.url ? 'noopener noreferrer' : undefined}
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
									<line x1="7" y1="17" x2="17" y2="7"/>
									<polyline points="7 7 17 7 17 17"/>
								</svg>
							</a>
						</div>

						<h2 class="card-title">{project.title}</h2>

						<p class="card-desc">
							{locale === 'en' ? (project.description_en ?? project.description_nl) : project.description_nl}
						</p>

						<div class="card-tags">
							{#each (project.tags ?? []) as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					</div>
				</article>
			{/each}
		</div>

	</div>
</div>

<style>
	.portfolio-page {
		padding-top: clamp(6rem, 12vw, 10rem);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: var(--c-fg-muted);
		text-decoration: none;
		margin-bottom: 3rem;
		transition: color 0.15s;
	}

	.back-link:hover { color: var(--c-fg); }

	.page-head {
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}

	.page-h1 {
		font-family: var(--font-heading);
		font-size: clamp(2.5rem, 7vw, 5rem);
		letter-spacing: -0.03em;
		line-height: 1.05;
		color: var(--c-fg);
		margin: 0.5rem 0 0.75rem;
	}

	.page-sub {
		font-size: clamp(0.95rem, 2vw, 1.05rem);
		color: var(--c-fg-muted);
		line-height: 1.65;
		margin: 0;
		max-width: 480px;
	}

	.portfolio-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		overflow: hidden;
	}

	.project-card {
		background: var(--c-bg);
		border-bottom: 1px solid var(--c-border-site);
		transition: background 0.15s ease;
		display: flex;
		flex-direction: column;
	}

	.project-card:last-child { border-bottom: none; }
	.project-card:hover { background: var(--c-bg-alt); }

	.card-image {
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-bottom: 1px solid var(--c-border-site);
		flex-shrink: 0;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.card-placeholder {
		width: 100%;
		height: 100%;
		background: var(--c-bg-alt);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	.card-placeholder::before {
		content: '';
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			-45deg,
			transparent,
			transparent 12px,
			var(--c-border-site) 12px,
			var(--c-border-site) 13px
		);
		opacity: 0.4;
	}

	.placeholder-label {
		font-family: var(--font-heading);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		position: relative;
		z-index: 1;
		background: var(--c-bg);
		padding: 0.35rem 0.75rem;
		border: 1px solid var(--c-border-site);
		border-radius: 4px;
	}

	.card-body { padding: 1.5rem; flex: 1; }

	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.card-year {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--c-fg-muted);
		text-transform: uppercase;
	}

	.card-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border: 1px solid var(--c-border-site);
		border-radius: 6px;
		color: var(--c-fg-muted);
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.card-link:hover {
		color: var(--c-fg);
		border-color: var(--c-fg);
	}

	.card-title {
		font-family: var(--font-heading);
		font-size: clamp(1.1rem, 2.5vw, 1.4rem);
		letter-spacing: -0.01em;
		color: var(--c-fg);
		margin: 0 0 0.6rem 0;
		line-height: 1.2;
	}

	.card-desc {
		font-size: 0.875rem;
		color: var(--c-fg-muted);
		line-height: 1.6;
		margin: 0 0 1.1rem 0;
	}

	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.tag {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		border: 1px solid var(--c-border-site);
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
	}

	@media (min-width: 640px) {
		.portfolio-grid { grid-template-columns: 1fr 1fr; }

		.project-card { border-right: 1px solid var(--c-border-site); }
		.project-card:nth-child(2n) { border-right: none; }
		.project-card:nth-last-child(-n+2) { border-bottom: none; }
		.project-card:last-child { border-bottom: none; }
	}

	@media (min-width: 1024px) {
		.portfolio-grid { grid-template-columns: repeat(3, 1fr); }

		.project-card:nth-child(2n) { border-right: 1px solid var(--c-border-site); }
		.project-card:nth-last-child(-n+2) { border-bottom: 1px solid var(--c-border-site); }
		.project-card { border-right: 1px solid var(--c-border-site); border-bottom: 1px solid var(--c-border-site); }
		.project-card:nth-child(3n) { border-right: none; }
		.project-card:last-child:not(:nth-child(3n)) { border-right: none; }
		.project-card:nth-last-child(-n+3) { border-bottom: none; }
		.project-card:not(:nth-last-child(-n+3)) { border-bottom: 1px solid var(--c-border-site); }
	}
</style>
