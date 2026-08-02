<script>
	import { m } from '$lib/paraglide/messages.js';
</script>

<section class="section" id="over-mij">
	<div class="section-inner">
		<span class="section-label">{m.about_label()}</span>

		<div class="about-grid">
			<div class="about-text">
				<h2 class="about-heading">{m.about_heading()}</h2>
				<p class="about-tagline">{m.about_tagline()}</p>
				<p>{m.about_bio_1()}</p>
				<p>{m.about_bio_2()}</p>

				<a href="/over-mij" class="read-more-link">
					{m.about_read_more()}
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<line x1="5" y1="12" x2="19" y2="12" />
						<polyline points="12 5 19 12 12 19" />
					</svg>
				</a>
			</div>

			<div class="about-aside">
				<div class="skills-block">
					<span class="skills-heading">{m.about_skills_heading()}</span>
					<ul class="skills-list">
						<li class="skill-item">
							<span class="skill-dot" aria-hidden="true"></span>
							{m.about_skill_1()}
						</li>
						<li class="skill-item">
							<span class="skill-dot" aria-hidden="true"></span>
							{m.about_skill_2()}
						</li>
						<li class="skill-item">
							<span class="skill-dot" aria-hidden="true"></span>
							{m.about_skill_3()}
						</li>
					</ul>
				</div>
			</div>
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
		margin-bottom: 3rem;
	}

	.about-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
	}

	.about-heading {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5vw, 3.5rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0 0 1rem 0;
	}

	.about-tagline {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--c-fg-muted);
		margin: 0 0 1.5rem 0;
		letter-spacing: 0.01em;
		line-height: 1.5;
	}

	.about-text p:not(.about-tagline) {
		max-width: 560px;
		line-height: 1.7;
	}

	.read-more-link {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--c-fg-muted);
		text-decoration: none;
		margin-top: 0.5rem;
		transition: color 0.15s ease;
	}

	.read-more-link:hover {
		color: var(--c-fg);
	}

	.about-aside {
		display: flex;
		align-items: flex-start;
	}

	.skills-block {
		border: 1px solid var(--c-border-site);
		padding: 1.75rem;
		border-radius: 8px;
		width: 100%;
	}

	.skills-heading {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		margin-bottom: 1.25rem;
	}

	.skills-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.skill-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--c-fg);
	}

	.skill-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--c-fg);
		flex-shrink: 0;
	}

	@media (min-width: 768px) {
		.about-grid {
			grid-template-columns: 1.4fr 1fr;
			gap: 4rem;
			align-items: start;
		}

		.about-aside {
			padding-top: 1rem;
		}
	}
</style>
