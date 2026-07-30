<script>
	import { m } from '$lib/paraglide/messages.js';
	import { slide } from 'svelte/transition';

	let openIndex = $state(null);

	function toggle(i) {
		openIndex = openIndex === i ? null : i;
	}

	const faqs = [
		{ q: () => m.faq_1_q(), a: () => m.faq_1_a() },
		{ q: () => m.faq_2_q(), a: () => m.faq_2_a() },
		{ q: () => m.faq_3_q(), a: () => m.faq_3_a() },
		{ q: () => m.faq_4_q(), a: () => m.faq_4_a() },
		{ q: () => m.faq_5_q(), a: () => m.faq_5_a() }
	];
</script>

<section class="section" id="faq">
	<div class="section-inner">
		<span class="section-label">{m.faq_label()}</span>
		<h2 class="faq-heading">{m.faq_heading()}</h2>

		<div class="faq-list">
			{#each faqs as faq, i}
				<div class="faq-item" class:open={openIndex === i}>
					<button class="faq-question" onclick={() => toggle(i)} aria-expanded={openIndex === i}>
						<span>{faq.q()}</span>
						<span class="faq-icon" aria-hidden="true">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<line x1="12" y1="5" x2="12" y2="19" class:hidden={openIndex === i} />
								<line x1="5" y1="12" x2="19" y2="12" />
							</svg>
						</span>
					</button>
					{#if openIndex === i}
						<div class="faq-answer" transition:slide={{ duration: 250 }}>
							<p>{faq.a()}</p>
						</div>
					{/if}
				</div>
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

	.faq-heading {
		font-family: var(--font-heading);
		font-size: clamp(1.75rem, 4vw, 3rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0 0 3rem 0;
	}

	.faq-list {
		border-top: 1px solid var(--c-border-site);
	}

	.faq-item {
		border-bottom: 1px solid var(--c-border-site);
	}

	.faq-question {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		padding: 1.5rem 0;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		font-size: clamp(0.95rem, 2vw, 1.05rem);
		font-weight: 500;
		color: var(--c-fg);
		font-family: var(--font-body);
		transition: color 0.15s ease;
	}

	.faq-question:hover {
		color: var(--c-fg-muted);
	}

	.faq-icon {
		flex-shrink: 0;
		color: var(--c-fg-muted);
		display: flex;
		align-items: center;
		transition: transform 0.25s ease;
	}

	.open .faq-icon {
		transform: rotate(45deg);
	}

	.hidden {
		display: none;
	}

	.faq-answer {
		overflow: hidden;
	}

	.faq-answer p {
		padding: 0 0 1.5rem 0;
		font-size: 0.925rem;
		line-height: 1.7;
		color: var(--c-fg-muted);
		margin: 0;
		max-width: 680px;
	}

	@media (min-width: 768px) {
		.faq-question {
			padding: 1.75rem 0;
		}
	}
</style>
