<script>
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import portfolioData from '$lib/data/portfolio.json';

	let locale = $state('nl');

	$effect(() => {
		try {
			locale = getLocale();
		} catch {
			locale = 'nl';
		}
	});
</script>

<section class="section" id="portfolio">
	<div class="section-inner">
		<span class="section-label">{m.portfolio_label()}</span>
		<h2 class="portfolio-heading">{m.portfolio_heading()}</h2>

		<div class="portfolio-grid">
			{#each portfolioData as project}
				<article class="project-card">
					<div class="card-image">
						{#if project.image}
							<img src={project.image} alt={project.title} loading="lazy" />
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
								href={project.url}
								class="card-link"
								aria-label="{project.title} {m.portfolio_view()}"
								target={project.url !== '#' ? '_blank' : undefined}
								rel={project.url !== '#' ? 'noopener noreferrer' : undefined}
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
									<line x1="7" y1="17" x2="17" y2="7"/>
									<polyline points="7 7 17 7 17 17"/>
								</svg>
							</a>
						</div>

						<h3 class="card-title">{project.title}</h3>

						<p class="card-desc">
							{locale === 'en' ? project.description_en : project.description_nl}
						</p>

						<div class="card-tags">
							{#each project.tags as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.section-label {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		margin-bottom: 1rem;
	}

	.portfolio-heading {
		font-family: var(--font-heading);
		font-size: clamp(1.75rem, 4vw, 3rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0 0 3rem 0;
	}

	.portfolio-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1px;
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

	.project-card:last-child {
		border-bottom: none;
	}

	.project-card:hover {
		background: var(--c-bg-alt);
	}

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

	.card-body {
		padding: 1.5rem;
		flex: 1;
	}

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
		.portfolio-grid {
			grid-template-columns: 1fr 1fr;
		}

		.project-card {
			border-bottom: none;
			border-right: 1px solid var(--c-border-site);
		}

		.project-card:last-child {
			border-right: none;
		}

		.project-card:nth-child(even) {
			border-right: none;
		}

		.project-card:not(:nth-last-child(-n+2)) {
			border-bottom: 1px solid var(--c-border-site);
		}
	}

	@media (min-width: 1024px) {
		.portfolio-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.project-card:nth-child(even) {
			border-right: 1px solid var(--c-border-site);
		}

		.project-card:nth-child(3n) {
			border-right: none;
		}

		.project-card:not(:nth-last-child(-n+3)) {
			border-bottom: 1px solid var(--c-border-site);
		}
	}
</style>
