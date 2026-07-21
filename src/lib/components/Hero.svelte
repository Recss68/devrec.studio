<script>
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { openQuote } from '$lib/stores/quote.js';

	let displayText = $state('');
	let typingDone = $state(false);

	onMount(() => {
		const fullText = m.hero_heading();
		let i = 0;

		const typeInterval = setInterval(() => {
			if (i < fullText.length) {
				displayText = fullText.slice(0, i + 1);
				i++;
			} else {
				clearInterval(typeInterval);
				typingDone = true;
			}
		}, 55);

		return () => clearInterval(typeInterval);
	});
</script>

<section class="hero-wrapper" id="home">
	<div class="hero-gradient" aria-hidden="true"></div>

	<div class="hero">
		<div class="hero-inner">
			<span class="hero-label">{m.hero_label()}</span>

			<h1 class="hero-heading" aria-label={m.hero_heading()}>
				{#each (displayText.match(/\S+|\s+/g) || []) as token, ti (ti)}
					{#if /\s/.test(token)}{token}{:else}<span class="word">{#each token.split('') as char, ci (ci)}<span class="char">{char}</span>{/each}</span>{/if}
				{/each}<span class="cursor" class:blink={typingDone} aria-hidden="true">|</span>
			</h1>

			<p class="hero-subtitle">{m.hero_subtitle()}</p>

			<div class="hero-cta">
				<a href="#contact" class="btn btn-primary">{m.hero_cta_primary()}</a>
				<button onclick={() => openQuote()} class="btn btn-secondary">{m.hero_cta_secondary()}</button>
			</div>
		</div>

		<a href="#portfolio" class="scroll-indicator" aria-label={m.hero_scroll()}>
			<span class="scroll-text">{m.hero_scroll()}</span>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<line x1="12" y1="5" x2="12" y2="19" />
				<polyline points="19 12 12 19 5 12" />
			</svg>
		</a>
	</div>
</section>

<style>
	.hero-wrapper {
		position: relative;
		min-height: 100svh;
		overflow: hidden;
		max-width: 100%;
		background: var(--hero-bg);
		transition: background 0.2s ease;
	}

	.hero-gradient {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--hero-gradient-opacity);
		transition: opacity 0.2s ease;
		background:
			radial-gradient(ellipse 120% 70% at -10% 110%, hsla(272, 80%, 52%, 0.65) 0%, transparent 55%),
			radial-gradient(ellipse 100% 65% at 110% 95%, hsla(260, 78%, 48%, 0.60) 0%, transparent 55%),
			radial-gradient(ellipse 80% 50% at 50% 120%, hsla(266, 75%, 45%, 0.30) 0%, transparent 50%);
	}

	.hero {
		position: relative;
		z-index: 1;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		padding: 8rem clamp(1.25rem, 5vw, 2.5rem) 5rem;
		max-width: 1280px;
		margin-inline: auto;
		width: 100%;
	}

	.hero-inner {
		max-width: 900px;
	}

	.hero-label {
		display: inline-block;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--hero-text-muted);
		margin-bottom: 1.5rem;
		border: 1px solid var(--hero-border);
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.hero-heading {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 9vw, 7.5rem);
		line-height: 1.0;
		letter-spacing: -0.03em;
		color: var(--hero-text);
		margin: 0 0 1.5rem 0;
		transition: color 0.2s ease;
		min-height: 1.1em;
		word-break: break-word;
	}

	.char {
		display: inline-block;
		animation: char-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.word {
		display: inline-block;
		white-space: nowrap;
	}

	@keyframes char-in {
		from {
			opacity: 0;
			transform: translateY(0.2em);
			filter: blur(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
			filter: blur(0);
		}
	}

	.cursor {
		display: inline-block;
		color: var(--hero-text);
		opacity: 1;
		font-weight: 100;
		margin-left: 0.02em;
	}

	.cursor.blink {
		animation: blink 0.85s step-end infinite;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}

	.hero-subtitle {
		font-size: clamp(1rem, 2.5vw, 1.2rem);
		color: var(--hero-text-muted);
		margin: 0 0 2.5rem 0;
		max-width: 480px;
		line-height: 1.65;
		transition: color 0.2s ease;
	}

	.hero-cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		font-family: var(--font-body);
		letter-spacing: 0.01em;
		border-radius: 6px;
		transition: opacity 0.15s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
		white-space: nowrap;
		cursor: pointer;
	}

	.btn-primary {
		background: var(--hero-btn-primary-bg);
		color: var(--hero-btn-primary-text);
		border: 1px solid var(--hero-btn-primary-bg);
	}

	.btn-primary:hover {
		opacity: 0.85;
	}

	.btn-secondary {
		background: transparent;
		color: var(--hero-btn-secondary-text);
		border: 1px solid var(--hero-btn-secondary-border);
	}

	.btn-secondary:hover {
		border-color: var(--hero-btn-secondary-text);
	}

	.scroll-indicator {
		position: absolute;
		bottom: 2.5rem;
		left: clamp(1.25rem, 5vw, 2.5rem);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--hero-scroll-color);
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.03em;
		transition: color 0.15s ease;
		animation: bounce 2s ease-in-out infinite;
	}

	.scroll-indicator:hover {
		color: var(--hero-text-muted);
	}

	.scroll-text {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.75rem;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(5px); }
	}

	@media (min-width: 768px) {
		.hero {
			padding-top: 10rem;
		}

		.hero-gradient {
			background:
				radial-gradient(ellipse 65% 80% at -5% 105%, hsla(272, 82%, 54%, 0.65) 0%, transparent 58%),
				radial-gradient(ellipse 60% 75% at 105% 95%, hsla(258, 78%, 50%, 0.60) 0%, transparent 58%),
				radial-gradient(ellipse 50% 40% at 50% 115%, hsla(265, 75%, 45%, 0.25) 0%, transparent 50%);
		}
	}

	@media (min-width: 1024px) {
		.hero-gradient {
			background:
				radial-gradient(ellipse 55% 85% at -5% 110%, hsla(272, 85%, 55%, 0.60) 0%, transparent 55%),
				radial-gradient(ellipse 50% 80% at 105% 100%, hsla(256, 80%, 50%, 0.55) 0%, transparent 55%),
				radial-gradient(ellipse 45% 45% at 50% 120%, hsla(264, 75%, 45%, 0.20) 0%, transparent 50%);
		}
	}
</style>
