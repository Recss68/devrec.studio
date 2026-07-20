<script>
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';

	const steps = $derived([
		{ title: m.process_step_1_title(), desc: m.process_step_1_desc() },
		{ title: m.process_step_2_title(), desc: m.process_step_2_desc() },
		{ title: m.process_step_3_title(), desc: m.process_step_3_desc() },
		{ title: m.process_step_4_title(), desc: m.process_step_4_desc() },
		{ title: m.process_step_5_title(), desc: m.process_step_5_desc() }
	]);

	// SVG coordinate space
	const VW = 160;
	const VH = 900;
	const ROW_H = VH / steps.length; // 180

	// Alternate nodes left/right
	const nodes = steps.map((_, i) => ({
		cx: i % 2 === 0 ? 32 : 128,
		cy: i * ROW_H + ROW_H / 2,
		left: i % 2 === 0
	}));

	// Smooth bezier path through nodes
	const pathD = nodes.reduce((d, c, i) => {
		if (i === 0) return `M ${c.cx} ${c.cy}`;
		const p = nodes[i - 1];
		const midY = (p.cy + c.cy) / 2;
		return `${d} C ${p.cx} ${midY}, ${c.cx} ${midY}, ${c.cx} ${c.cy}`;
	}, '');

	let sectionEl;
	let pathEl;
	let scrollProgress = $state(0);

	onMount(() => {
		if (!pathEl || !sectionEl) return;

		const len = pathEl.getTotalLength();
		pathEl.style.strokeDasharray = len;
		pathEl.style.strokeDashoffset = len;

		const update = () => {
			const rect = sectionEl.getBoundingClientRect();
			const wh = window.innerHeight;
			// Start when section enters viewport, finish when scrolled through
			const p = Math.max(0, Math.min(1, (wh - rect.top) / (rect.height + wh * 0.2)));
			scrollProgress = p;
			pathEl.style.strokeDashoffset = len * (1 - p);
		};

		window.addEventListener('scroll', update, { passive: true });
		update();
		return () => window.removeEventListener('scroll', update);
	});

	const nodeActive = (i) => scrollProgress > i / steps.length;
</script>

<section class="section process-section" id="werkwijze" bind:this={sectionEl}>
	<div class="section-inner">

		<div class="process-head">
			<span class="section-label">{m.process_label()}</span>
			<h2 class="process-h2">{m.process_heading()}</h2>
			<p class="process-lead">{m.process_lead()}</p>
		</div>

		<!-- ── Desktop: SVG S-curve track ── -->
		<div class="process-desktop" aria-hidden="true">
			<div class="process-grid">

				<!-- Center SVG column (spans all rows) -->
				<div class="track-col">
					<svg
						class="track-svg"
						viewBox="0 0 {VW} {VH}"
						preserveAspectRatio="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<!-- Background path -->
						<path class="path-bg" d={pathD} />
						<!-- Animated fill path -->
						<path class="path-fill" d={pathD} bind:this={pathEl} />

						<!-- Nodes -->
						{#each nodes as node, i}
							<g class="node" class:node-on={nodeActive(i)}>
								<circle class="node-ring" cx={node.cx} cy={node.cy} r="24" />
								<circle class="node-fill" cx={node.cx} cy={node.cy} r="17" />
								<text
									class="node-num"
									x={node.cx}
									y={node.cy}
									text-anchor="middle"
									dominant-baseline="central"
									font-family="sans-serif"
									font-size="13"
									font-weight="700"
								>{i + 1}</text>
							</g>
						{/each}
					</svg>
				</div>

				<!-- Step text items -->
				{#each steps as step, i}
					<div
						class="step-text"
						class:step-text-l={nodes[i].left}
						class:step-text-r={!nodes[i].left}
						style="grid-row: {i + 1}"
					>
						<strong class="step-title">{step.title}</strong>
						<p class="step-desc">{step.desc}</p>
					</div>
				{/each}

			</div>
		</div>

		<!-- ── Mobile: vertical timeline ── -->
		<div class="process-mobile">
			<div class="mobile-track" aria-hidden="true">
				<div class="mobile-track-bg"></div>
				<div class="mobile-track-fill" style="height: {Math.min(scrollProgress * 130, 100)}%"></div>
			</div>
			<ol class="mobile-steps" aria-label="Werkwijze stappen">
				{#each steps as step, i}
					<li class="mobile-step">
						<div class="mobile-dot" class:mobile-dot-on={nodeActive(i)} aria-hidden="true">
							{i + 1}
						</div>
						<div class="mobile-content">
							<strong class="step-title">{step.title}</strong>
							<p class="step-desc">{step.desc}</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>

		<!-- ── Bonus note ── -->
		<div class="process-bonus">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" flex-shrink="0">
				<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
				<polyline points="22,6 12,13 2,6"/>
			</svg>
			<span>{m.process_bonus_pre()} <strong>{m.process_bonus_count()}</strong> {m.process_bonus_post()} (<em>{m.process_bonus_example()}</em>).</span>
		</div>

	</div>
</section>

<style>
	/* Section header */
	.process-head {
		margin-bottom: clamp(3rem, 5vw, 4rem);
	}

	.process-h2 {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5vw, 3.5rem);
		letter-spacing: -0.03em;
		line-height: 1.05;
		color: var(--c-fg);
		margin: 0.5rem 0 0.75rem;
	}

	.process-lead {
		font-size: clamp(0.95rem, 2vw, 1.05rem);
		color: var(--c-fg-muted);
		line-height: 1.65;
		max-width: 520px;
		margin: 0;
	}

	/* ── Layout switching ── */
	/* Mobile hidden by default, shown only on narrow screens */
	.process-mobile  { display: none; }
	/* Desktop hidden on narrow screens */
	.process-desktop { display: none; }

	@media (max-width: 767px) {
		.process-mobile  { display: block; }
	}

	@media (min-width: 768px) {
		.process-desktop { display: block; }
	}

	.process-grid {
		display: grid;
		grid-template-columns: 1fr 160px 1fr;
		grid-template-rows: repeat(5, 180px);
		align-items: center;
	}

	/* SVG track column — spans all 5 rows */
	.track-col {
		grid-column: 2;
		grid-row: 1 / -1;
		align-self: stretch;
	}

	.track-svg {
		width: 100%;
		height: 100%;
		display: block;
		overflow: visible;
	}

	/* Paths */
	.path-bg {
		fill: none;
		stroke: var(--c-border-site);
		stroke-width: 2.5;
	}

	.path-fill {
		fill: none;
		stroke: var(--c-fg);
		stroke-width: 2.5;
		stroke-linecap: round;
	}

	/* Nodes */
	.node-ring {
		fill: none;
		stroke: var(--c-border-site);
		stroke-width: 1.5;
		transition: stroke 0.5s ease;
	}

	.node-fill {
		fill: var(--c-bg);
		stroke: var(--c-border-site);
		stroke-width: 1.5;
		transition: fill 0.5s ease, stroke 0.5s ease;
	}

	.node-num {
		fill: var(--c-fg-muted);
		transition: fill 0.5s ease;
		pointer-events: none;
		user-select: none;
	}

	.node.node-on .node-ring {
		stroke: var(--c-fg);
	}

	.node.node-on .node-fill {
		fill: var(--c-fg);
		stroke: var(--c-fg);
	}

	.node.node-on .node-num {
		fill: var(--c-bg);
	}

	/* Step text */
	.step-text {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding-block: 0.5rem;
	}

	.step-text-l {
		grid-column: 1;
		text-align: right;
		align-items: flex-end;
		padding-right: 2rem;
	}

	.step-text-r {
		grid-column: 3;
		text-align: left;
		align-items: flex-start;
		padding-left: 2rem;
	}

	.step-title {
		font-family: var(--font-heading);
		font-size: clamp(0.95rem, 1.5vw, 1.1rem);
		letter-spacing: -0.01em;
		color: var(--c-fg);
		line-height: 1.2;
	}

	.step-desc {
		font-size: clamp(0.8rem, 1.2vw, 0.88rem);
		color: var(--c-fg-muted);
		line-height: 1.6;
		margin: 0;
		max-width: 260px;
	}

	.step-text-l .step-desc { margin-left: auto; }

	/* ── Mobile layout ── */
	.process-mobile {
		position: relative;
	}

	.mobile-steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.mobile-track {
		position: absolute;
		left: 18px;
		top: 18px;
		bottom: 18px;
		width: 2px;
		z-index: 0;
	}

	.mobile-track-bg,
	.mobile-track-fill {
		position: absolute;
		inset: 0;
		width: 100%;
		border-radius: 2px;
	}

	.mobile-track-bg  { background: var(--c-border-site); }
	.mobile-track-fill {
		background: var(--c-fg);
		bottom: auto;
		transition: height 0.1s linear;
	}

	.mobile-step {
		display: flex;
		align-items: flex-start;
		gap: 1.25rem;
		padding: 0 0 2.25rem 0;
		position: relative;
		z-index: 1;
	}

	.mobile-step:last-child { padding-bottom: 0; }

	.mobile-dot {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 2px solid var(--c-border-site);
		background: var(--c-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--c-fg-muted);
		transition: background 0.4s ease, border-color 0.4s ease, color 0.4s ease;
	}

	.mobile-dot.mobile-dot-on {
		background: var(--c-fg);
		border-color: var(--c-fg);
		color: var(--c-bg);
	}

	.mobile-content {
		padding-top: 0.4rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.mobile-content .step-desc { max-width: none; }

	/* ── Bonus note ── */
	.process-bonus {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		margin-top: clamp(2.5rem, 5vw, 4rem);
		padding: 1rem 1.25rem;
		border: 1px solid var(--c-border-site);
		border-radius: 10px;
		background: var(--c-bg-alt);
		font-size: 0.875rem;
		color: var(--c-fg-muted);
		line-height: 1.6;
		max-width: 600px;
	}

	.process-bonus svg {
		flex-shrink: 0;
		margin-top: 2px;
		color: var(--c-fg-muted);
	}

	.process-bonus strong { color: var(--c-fg); }
	.process-bonus em { font-style: normal; }
</style>
