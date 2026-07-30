<script>
	import { m } from '$lib/paraglide/messages.js';
	import { openQuote } from '$lib/stores/quote.js';
</script>

<section class="section" id="diensten">
	<div class="section-inner">
		<span class="section-label">{m.services_label()}</span>
		<h2 class="services-heading">{m.services_heading()}</h2>

		<div class="services-grid">
			<article class="service-card">
				<div class="service-number" aria-hidden="true">01</div>
				<h3 class="service-title">{m.service_1_title()}</h3>
				<p class="service-desc">{m.service_1_desc()}</p>
				<div class="service-tags">
					<span class="service-tag">{m.service_1_tag_1()}</span>
					<span class="service-tag">{m.service_1_tag_2()}</span>
					<span class="service-tag">{m.service_1_tag_3()}</span>
				</div>
				<button class="service-quote-btn" onclick={() => openQuote('web')}
					>{m.quote_modal_title()}</button
				>
			</article>

			<article class="service-card">
				<div class="service-number" aria-hidden="true">02</div>
				<h3 class="service-title">{m.service_2_title()}</h3>
				<p class="service-desc">{m.service_2_desc()}</p>
				<button class="service-quote-btn" onclick={() => openQuote('hosting')}
					>{m.quote_modal_title()}</button
				>
			</article>

			<article class="service-card">
				<div class="service-number" aria-hidden="true">03</div>
				<h3 class="service-title">{m.service_3_title()}</h3>
				<p class="service-desc">{m.service_3_desc()}</p>
				<button class="service-quote-btn" onclick={() => openQuote('shop')}
					>{m.quote_modal_title()}</button
				>
			</article>

			<article class="service-card">
				<div class="service-number" aria-hidden="true">04</div>
				<h3 class="service-title">{m.service_4_title()}</h3>
				<p class="service-desc">{m.service_4_desc()}</p>
				<div class="service-tags">
					<span class="service-tag">{m.service_4_tag_1()}</span>
					<span class="service-tag">{m.service_4_tag_2()}</span>
					<span class="service-tag">{m.service_4_tag_3()}</span>
				</div>
				<button class="service-quote-btn" onclick={() => openQuote('optimization')}
					>{m.quote_modal_title()}</button
				>
			</article>

			<article class="service-card">
				<div class="service-number" aria-hidden="true">05</div>
				<h3 class="service-title">{m.service_5_title()}</h3>
				<p class="service-desc">{m.service_5_desc()}</p>
				<div class="service-tags">
					<span class="service-tag">{m.service_5_tag_1()}</span>
					<span class="service-tag">{m.service_5_tag_2()}</span>
					<span class="service-tag">{m.service_5_tag_3()}</span>
				</div>
				<button class="service-quote-btn" onclick={() => openQuote('marketing')}
					>{m.quote_modal_title()}</button
				>
			</article>
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

	.services-heading {
		font-family: var(--font-heading);
		font-size: clamp(1.75rem, 4vw, 3rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0 0 3rem 0;
	}

	.services-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		overflow: hidden;
	}

	.service-card {
		padding: 2rem 2rem 2.5rem;
		background: var(--c-bg);
		border-bottom: 1px solid var(--c-border-site);
		transition: background 0.15s ease;
	}

	.service-card:last-child {
		border-bottom: none;
	}

	.service-card:hover {
		background: var(--c-bg-alt);
	}

	.service-number {
		font-family: var(--font-heading);
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		color: var(--c-fg-muted);
		margin-bottom: 1.25rem;
	}

	.service-title {
		font-family: var(--font-heading);
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		letter-spacing: -0.01em;
		color: var(--c-fg);
		margin: 0 0 0.75rem 0;
		line-height: 1.2;
	}

	.service-desc {
		font-size: 0.9rem;
		color: var(--c-fg-muted);
		line-height: 1.65;
		margin: 0 0 1.25rem 0;
		max-width: 380px;
	}

	.service-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.service-tag {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--c-fg);
		border: 1px solid var(--c-border-site);
		padding: 0.25rem 0.65rem;
		border-radius: 999px;
	}

	.service-quote-btn {
		margin-top: auto;
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: none;
		border: 1px solid var(--c-border-site);
		border-radius: 6px;
		padding: 0.45rem 0.9rem;
		font-size: 0.78rem;
		font-weight: 600;
		font-family: var(--font-body);
		color: var(--c-fg-muted);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
		margin-top: 1.25rem;
	}

	.service-quote-btn:hover {
		border-color: var(--c-fg);
		color: var(--c-fg);
	}

	@media (min-width: 640px) {
		.services-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.service-card {
			border-bottom: 1px solid var(--c-border-site);
			border-right: 1px solid var(--c-border-site);
		}

		/* Remove right border on even cards (last in each 2-col row) */
		.service-card:nth-child(2n) {
			border-right: none;
		}

		/* Last card and 2nd-to-last in last row have no bottom border */
		.service-card:nth-last-child(-n + 2):nth-child(2n + 1),
		.service-card:last-child {
			border-bottom: none;
		}
	}

	@media (min-width: 1024px) {
		.services-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		/* Reset 2-col override: nth-child(2n) has higher specificity (0,2,0) than
		   the generic .service-card rule (0,1,0), so it must be explicitly undone here */
		.service-card:nth-child(2n) {
			border-right: 1px solid var(--c-border-site);
		}

		.service-card {
			border-right: 1px solid var(--c-border-site);
			border-bottom: 1px solid var(--c-border-site);
		}

		/* No right border on 3rd column */
		.service-card:nth-child(3n) {
			border-right: none;
		}

		/* No right border on last card when it doesn't land on the 3rd column */
		.service-card:last-child:not(:nth-child(3n)) {
			border-right: none;
		}

		/* Items in last row have no bottom border */
		.service-card:nth-child(n + 4) {
			border-bottom: none;
		}
	}
</style>
