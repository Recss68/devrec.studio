<script>
	import { m } from '$lib/paraglide/messages.js';

	let urlInput = $state('');
	let loading = $state(false);
	let result = $state(null);
	let errMsg = $state('');
	let animated = $state(false);
	let loadingStep = $state(0);
	let email = $state('');
	let reportSent = $state(false);
	let openFaq = $state(null);

	const CIRC = 251.33;

	const loadingSteps = $derived([
		m.check_loading_1(),
		m.check_loading_2(),
		m.check_loading_3(),
		m.check_loading_4(),
		m.check_loading_5()
	]);

	const cats = $derived([
		{ key: 'performance',    label: m.check_cat_performance_label(),    desc: m.check_cat_performance_desc() },
		{ key: 'accessibility',  label: m.check_cat_accessibility_label(),  desc: m.check_cat_accessibility_desc() },
		{ key: 'seo',            label: m.check_cat_seo_label(),            desc: m.check_cat_seo_desc() },
		{ key: 'best-practices', label: m.check_cat_bestpractices_label(),  desc: m.check_cat_bestpractices_desc() }
	]);

	const vitals = $derived([
		{ key: 'first-contentful-paint',  label: m.check_vital_fcp_label(), tip: m.check_vital_fcp_tip() },
		{ key: 'largest-contentful-paint',label: m.check_vital_lcp_label(), tip: m.check_vital_lcp_tip() },
		{ key: 'total-blocking-time',     label: m.check_vital_tbt_label(), tip: m.check_vital_tbt_tip() },
		{ key: 'cumulative-layout-shift', label: m.check_vital_cls_label(), tip: m.check_vital_cls_tip() },
		{ key: 'speed-index',             label: m.check_vital_si_label(),  tip: m.check_vital_si_tip() }
	]);

	const faqs = $derived([
		{ q: m.check_faq_1_q(), a: m.check_faq_1_a() },
		{ q: m.check_faq_2_q(), a: m.check_faq_2_a() },
		{ q: m.check_faq_3_q(), a: m.check_faq_3_a() },
		{ q: m.check_faq_4_q(), a: m.check_faq_4_a() },
		{ q: m.check_faq_5_q(), a: m.check_faq_5_a() }
	]);

	function scoreColor(s) {
		if (s >= 90) return '#22c55e';
		if (s >= 50) return '#f97316';
		return '#ef4444';
	}

	function scoreLabel(s) {
		if (s >= 90) return m.check_score_excellent();
		if (s >= 70) return m.check_score_good();
		if (s >= 50) return m.check_score_fair();
		return m.check_score_poor();
	}

	function getScore(key) {
		const s = result?.lighthouseResult?.categories?.[key]?.score;
		return s != null ? Math.round(s * 100) : 0;
	}

	function getVital(key) {
		const a = result?.lighthouseResult?.audits?.[key];
		if (!a) return { value: '—', score: null };
		return { value: a.displayValue ?? '—', score: a.score };
	}

	function vitalDot(score) {
		if (score == null) return '#888';
		if (score >= 0.9) return '#22c55e';
		if (score >= 0.5) return '#f97316';
		return '#ef4444';
	}

	function stripMd(str = '') {
		return str.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`([^`]+)`/g, '$1');
	}

	const AGENTIC_IDS = [
		'llms-txt',
		'agent-accessibility-tree',
		'cumulative-layout-shift',
		'webmcp-registered-tools',
		'webmcp-form-coverage',
		'webmcp-schema-validity'
	];

	function getAgenticAudits() {
		const audits = result?.lighthouseResult?.audits;
		if (!audits) return [];
		return AGENTIC_IDS.map((id) => {
			const a = audits[id];
			if (!a) return null;
			return { id, title: a.title, displayValue: a.displayValue ?? null, score: a.score, displayMode: a.scoreDisplayMode };
		}).filter(Boolean);
	}

	function improvements() {
		if (!result) return [];
		const audits = result.lighthouseResult?.audits ?? {};
		return Object.values(audits)
			.filter((a) => a.score != null && a.score < 0.9 && a.title && a.description)
			.sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
			.slice(0, 6);
	}

	let loadingTimer;

	async function runCheck() {
		if (!urlInput.trim() || loading) return;
		loading = true;
		result = null;
		errMsg = '';
		animated = false;
		loadingStep = 0;

		loadingTimer = setInterval(() => {
			loadingStep = (loadingStep + 1) % loadingSteps.length;
		}, 2800);

		try {
			const res = await fetch('/api/check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: urlInput.trim() })
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				errMsg = data.message ?? m.check_error_default();
				return;
			}

			result = await res.json();
			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					animated = true;
				})
			);
		} catch {
			errMsg = m.check_error_connection();
		} finally {
			clearInterval(loadingTimer);
			loading = false;
		}
	}

	function handleKey(e) {
		if (e.key === 'Enter') runCheck();
	}

	async function sendReport() {
		try {
			const res = await fetch('/api/check-report', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: urlInput, email })
			});

			if (!res.ok) return;
		} catch {
			// silently ignore, still mark sent
		}

		reportSent = true;
	}
</script>

<svelte:head>
	<title>{m.check_page_title()}</title>
	<meta name="description" content={m.check_meta_desc()} />
	<meta property="og:title" content={m.check_og_title()} />
	<meta property="og:description" content={m.check_og_desc()} />
	<meta name="twitter:title" content={m.check_og_title()} />
	<meta name="twitter:description" content={m.check_og_desc()} />
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: m.check_h1(),
		description: m.check_meta_desc(),
		url: 'https://devrec.nl/gratis-website-check',
		applicationCategory: 'UtilityApplication',
		operatingSystem: 'Web',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
		creator: { '@type': 'Organization', name: 'devrec', url: 'https://devrec.nl' }
	})}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	})}<\/script>`}
</svelte:head>

<!-- Hero / Input -->
<section class="checker-hero">
	<div class="checker-inner">
		<a href="/" class="back-link">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
			</svg>
			{m.check_back()}
		</a>

		<span class="tool-badge">{m.check_badge()}</span>
		<h1 class="checker-h1">{m.check_h1()}</h1>
		<p class="checker-sub">{m.check_sub()}</p>

		<div class="url-form" role="search">
			<input
				type="url"
				placeholder={m.check_input_placeholder()}
				bind:value={urlInput}
				onkeydown={handleKey}
				disabled={loading}
				class="url-input"
				aria-label={m.check_input_aria()}
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
			/>
			<button onclick={runCheck} disabled={loading || !urlInput.trim()} class="url-btn" aria-label={m.check_analyse_aria()}>
				{#if loading}
					<span class="btn-spinner" aria-hidden="true"></span>
				{:else}
					{m.check_analyse_btn()}
				{/if}
			</button>
		</div>

		<p class="url-hint">{m.check_url_hint()} <em>{m.check_url_hint_example()}</em></p>
	</div>
</section>

<!-- Loading -->
{#if loading}
	<section class="loading-section">
		<div class="checker-inner loading-inner">
			<div class="loading-ring" aria-hidden="true">
				<svg viewBox="0 0 100 100" width="90" height="90" class="loading-svg">
					<circle cx="50" cy="50" r="38" fill="none" stroke="var(--c-border-site)" stroke-width="6" />
					<circle cx="50" cy="50" r="38" fill="none" stroke="var(--c-fg)" stroke-width="6" stroke-linecap="round"
						stroke-dasharray="239" stroke-dashoffset="180" />
				</svg>
			</div>
			<p class="loading-step">{loadingSteps[loadingStep]}</p>
			<p class="loading-hint">{m.check_loading_hint()}</p>
		</div>
	</section>
{/if}

<!-- Error -->
{#if errMsg}
	<section class="error-section">
		<div class="checker-inner">
			<div class="error-box" role="alert">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
				{errMsg}
			</div>
		</div>
	</section>
{/if}

<!-- Results -->
{#if result}
	{@const scores = cats.map((c) => ({ ...c, score: getScore(c.key) }))}
	{@const tips = improvements()}

	<section class="results-section">
		<div class="checker-inner">

			<!-- Score cards -->
			<h2 class="results-heading">{m.check_results_heading()}</h2>
			<p class="results-url">{m.check_results_analysed()} <strong>{result.lighthouseResult?.finalUrl ?? urlInput}</strong></p>

			<div class="score-grid">
				{#each scores as cat, i}
					{@const color = scoreColor(cat.score)}
					<div class="score-card">
						<svg viewBox="0 0 100 100" width="110" height="110" aria-label="{cat.label}: {cat.score} / 100">
							<circle cx="50" cy="50" r="40" fill="none" stroke="var(--c-border-site)" stroke-width="8" />
							<circle
								cx="50" cy="50" r="40"
								fill="none"
								stroke={color}
								stroke-width="8"
								stroke-linecap="round"
								stroke-dasharray={CIRC}
								style="stroke-dashoffset:{animated ? CIRC * (1 - cat.score / 100) : CIRC}; transition: stroke-dashoffset 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) {i * 0.12}s"
								transform="rotate(-90 50 50)"
							/>
							<text x="50" y="50" text-anchor="middle" dominant-baseline="central"
								font-size="20" font-weight="700" fill={color} font-family="sans-serif">{cat.score}</text>
						</svg>
						<div class="card-label">{cat.label}</div>
						<div class="card-rating" style="color:{color}">{scoreLabel(cat.score)}</div>
						<div class="card-desc">{cat.desc}</div>
					</div>
				{/each}
			</div>

			<!-- Core Web Vitals -->
			<div class="vitals-block">
				<h2 class="block-heading">{m.check_vitals_heading()}</h2>
				<p class="block-sub">{m.check_vitals_sub()}</p>
				<ul class="vitals-list">
					{#each vitals as v}
						{@const vital = getVital(v.key)}
						<li class="vital-row">
							<span class="vital-dot" style="background:{vitalDot(vital.score)}" aria-hidden="true"></span>
							<span class="vital-label">{v.label}</span>
							<span class="vital-tip">{v.tip}</span>
							<span class="vital-value">{vital.value}</span>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Improvements -->
			{#if tips.length > 0}
				<div class="tips-block">
					<h2 class="block-heading">{m.check_improvements_heading()}</h2>
					<p class="block-sub">{m.check_improvements_sub()}</p>
					<ul class="tips-list">
						{#each tips as tip}
							{@const score = tip.score ?? 0}
							<li class="tip-row">
								<span class="tip-icon" style="color:{score < 0.5 ? '#ef4444' : '#f97316'}" aria-hidden="true">
									{score < 0.5 ? '✗' : '~'}
								</span>
								<div class="tip-content">
									<strong class="tip-title">{tip.title}</strong>
									<span class="tip-desc">{stripMd(tip.description).slice(0, 120)}{tip.description.length > 120 ? '…' : ''}</span>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Agentic Browsing -->
			{#if result?.lighthouseResult?.categories?.['agentic-browsing']}
				{@const agAudits = getAgenticAudits()}
				{@const agPassed = agAudits.filter((a) => a.score === 1).length}
				{@const agTotal = agAudits.filter((a) => a.score !== null && a.displayMode !== 'notApplicable').length}
				<div class="agentic-block">
					<div class="agentic-head">
						<div>
							<h2 class="block-heading">{m.check_agentic_heading()}</h2>
							<p class="block-sub">{m.check_agentic_sub()}</p>
						</div>
						<span class="agentic-badge">{m.check_agentic_experimental()}</span>
					</div>

					<div class="agentic-score-row">
						<span class="agentic-fraction">
							{agPassed}<span class="agentic-denom">/{agTotal}</span>
						</span>
						<div class="agentic-bar" aria-hidden="true">
							<div
								class="agentic-bar-fill"
								style="width:{animated && agTotal > 0 ? (agPassed / agTotal) * 100 : 0}%"
							></div>
						</div>
						<span class="agentic-score-label">{m.check_agentic_score({ passed: agPassed, total: agTotal })}</span>
					</div>

					<ul class="agentic-list">
						{#each agAudits as audit}
							{@const isPass = audit.score === 1}
							{@const isNa = audit.score === null || audit.displayMode === 'notApplicable' || audit.displayMode === 'informative'}
							<li class="agentic-row">
								<span
									class="agentic-icon"
									class:agentic-icon-pass={isPass}
									class:agentic-icon-fail={!isPass && !isNa}
									class:agentic-icon-na={isNa}
									aria-hidden="true"
								>{#if isNa}–{:else if isPass}✓{:else}✗{/if}</span>
								<div class="agentic-audit-info">
									<span class="agentic-audit-title">{audit.title}</span>
									{#if audit.displayValue}
										<span class="agentic-audit-value">{audit.displayValue}</span>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

		</div>
	</section>

	<!-- Report CTA -->
	<section class="report-section">
		<div class="checker-inner report-inner">
			{#if !reportSent}
				<div class="report-label">{m.check_report_label()}</div>
				<h2 class="report-heading">{m.check_report_heading()}</h2>
				<p class="report-sub">{m.check_report_sub()}</p>
				<div class="report-form">
					<input
						type="email"
						bind:value={email}
						placeholder={m.check_report_placeholder()}
						class="report-input"
						aria-label={m.check_report_placeholder()}
					/>
					<button onclick={sendReport} disabled={!email.trim()} class="report-btn">
						{m.check_report_btn()}
					</button>
				</div>
				<p class="report-note">{m.check_report_note()}</p>
			{:else}
				<div class="report-success">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" aria-hidden="true">
						<circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
					</svg>
					<div>
						<strong>{m.check_report_success_title()}</strong>
						<p>{m.check_report_success_sub({ email })}</p>
					</div>
				</div>
			{/if}
		</div>
	</section>
{/if}

<!-- FAQ -->
<section class="faq-section">
	<div class="checker-inner">
		<h2 class="block-heading">{m.check_faq_heading()}</h2>
		<p class="block-sub">{m.check_faq_sub()}</p>

		<ul class="faq-list" role="list">
			{#each faqs as faq, i}
				<li class="faq-item">
					<button
						class="faq-q"
						class:open={openFaq === i}
						onclick={() => { openFaq = openFaq === i ? null : i; }}
						aria-expanded={openFaq === i}
					>
						{faq.q}
						<svg class="faq-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="2" aria-hidden="true">
							<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					</button>
					{#if openFaq === i}
						<p class="faq-a">{faq.a}</p>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	/* Layout */
	.checker-inner {
		max-width: 860px;
		margin-inline: auto;
		padding-inline: clamp(1rem, 5vw, 2rem);
	}

	/* Hero */
	.checker-hero {
		padding-block: clamp(6rem, 10vw, 9rem) clamp(3rem, 5vw, 4rem);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: var(--c-fg-muted);
		margin-bottom: 2rem;
		transition: color 0.15s;
	}
	.back-link:hover { color: var(--c-fg); }

	.tool-badge {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		border: 1px solid var(--c-border-site);
		padding: 0.25rem 0.7rem;
		border-radius: 999px;
		margin-bottom: 1.25rem;
	}

	.checker-h1 {
		font-family: var(--font-heading);
		font-size: clamp(1.75rem, 7vw, 4.5rem);
		line-height: 1.05;
		letter-spacing: -0.03em;
		color: var(--c-fg);
		margin: 0 0 1.25rem;
	}

	.checker-sub {
		font-size: clamp(0.95rem, 2vw, 1.1rem);
		color: var(--c-fg-muted);
		line-height: 1.7;
		max-width: 600px;
		margin: 0 0 2.5rem;
	}

	/* URL Form */
	.url-form {
		display: flex;
		gap: 0.5rem;
		flex-direction: column;
	}

	.url-input {
		flex: 1;
		padding: 0.9rem 1.1rem;
		font-size: 0.95rem;
		font-family: var(--font-body);
		background: var(--c-bg-alt);
		color: var(--c-fg);
		border: 1px solid var(--c-border-site);
		border-radius: 10px;
		outline: none;
		transition: border-color 0.15s;
		min-width: 0;
	}
	.url-input:focus { border-color: var(--c-fg); }
	.url-input:disabled { opacity: 0.5; cursor: not-allowed; }
	.url-input::placeholder { color: var(--c-fg-muted); }

	.url-btn {
		padding: 0.9rem 1.75rem;
		font-size: 0.9rem;
		font-weight: 600;
		font-family: var(--font-body);
		background: var(--c-fg);
		color: var(--c-bg);
		border: none;
		border-radius: 10px;
		cursor: pointer;
		transition: opacity 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		white-space: nowrap;
	}
	.url-btn:hover:not(:disabled) { opacity: 0.82; }
	.url-btn:disabled { opacity: 0.4; cursor: not-allowed; }

	@media (min-width: 540px) {
		.url-form { flex-direction: row; }
	}

	.url-hint {
		font-size: 0.78rem;
		color: var(--c-fg-muted);
		margin: 0.6rem 0 0;
	}
	.url-hint em { font-style: normal; }

	/* Loading */
	.loading-section {
		padding-block: 4rem;
	}
	.loading-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		text-align: center;
	}
	.loading-svg {
		animation: spin 1.3s linear infinite;
		transform-origin: center;
		display: block;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	.loading-step {
		font-size: 1rem;
		color: var(--c-fg);
		font-weight: 500;
		margin: 0;
	}
	.loading-hint {
		font-size: 0.82rem;
		color: var(--c-fg-muted);
		margin: 0;
	}
	.btn-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid var(--c-bg);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		display: inline-block;
	}

	/* Error */
	.error-section { padding-block: 2rem; }
	.error-box {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		background: rgba(239, 68, 68, 0.07);
		border: 1px solid rgba(239, 68, 68, 0.3);
		color: #ef4444;
		padding: 1rem 1.25rem;
		border-radius: 10px;
		font-size: 0.9rem;
		line-height: 1.5;
	}
	.error-box svg { flex-shrink: 0; margin-top: 1px; }

	/* Results */
	.results-section {
		padding-block: clamp(3rem, 6vw, 5rem);
		border-top: 1px solid var(--c-border-site);
	}

	.results-heading {
		font-family: var(--font-heading);
		font-size: clamp(1.6rem, 4vw, 2.4rem);
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0 0 0.4rem;
	}
	.results-url {
		font-size: 0.82rem;
		color: var(--c-fg-muted);
		margin: 0 0 2.5rem;
		word-break: break-all;
	}
	.results-url strong { color: var(--c-fg); }

	/* Score grid */
	.score-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		margin-bottom: 3rem;
	}

	@media (min-width: 640px) {
		.score-grid { grid-template-columns: repeat(4, 1fr); }
	}

	.score-card {
		background: var(--c-bg-alt);
		border: 1px solid var(--c-border-site);
		border-radius: 14px;
		padding: 1.25rem 0.75rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		text-align: center;
	}

	.card-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--c-fg);
	}
	.card-rating {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.03em;
	}
	.card-desc {
		font-size: 0.72rem;
		color: var(--c-fg-muted);
		line-height: 1.4;
	}

	/* Block shared styles */
	.block-heading {
		font-family: var(--font-heading);
		font-size: clamp(1.3rem, 3vw, 1.8rem);
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0 0 0.35rem;
	}
	.block-sub {
		font-size: 0.9rem;
		color: var(--c-fg-muted);
		margin: 0 0 1.5rem;
	}

	/* Vitals */
	.vitals-block {
		margin-bottom: 3rem;
	}
	.vitals-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.vital-row {
		display: grid;
		grid-template-columns: 10px 1fr auto;
		grid-template-rows: auto auto;
		gap: 0 0.75rem;
		align-items: start;
		padding: 0.9rem 0;
		border-bottom: 1px solid var(--c-border-site);
	}
	.vital-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		margin-top: 5px;
		grid-row: 1;
	}
	.vital-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--c-fg);
		grid-column: 2;
		grid-row: 1;
	}
	.vital-tip {
		font-size: 0.78rem;
		color: var(--c-fg-muted);
		grid-column: 2;
		grid-row: 2;
		line-height: 1.4;
	}
	.vital-value {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--c-fg);
		grid-column: 3;
		grid-row: 1 / 3;
		align-self: center;
		white-space: nowrap;
	}

	/* Tips */
	.tips-block { margin-bottom: 2rem; }
	.tips-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	@media (min-width: 640px) {
		.tips-list {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.tip-row {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		background: var(--c-bg-alt);
		border: 1px solid var(--c-border-site);
		border-radius: 10px;
		padding: 1rem;
	}
	.tip-icon {
		font-size: 1rem;
		font-weight: 700;
		flex-shrink: 0;
		margin-top: 1px;
	}
	.tip-content {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.tip-title {
		font-size: 0.85rem;
		color: var(--c-fg);
		font-weight: 600;
		line-height: 1.3;
	}
	.tip-desc {
		font-size: 0.78rem;
		color: var(--c-fg-muted);
		line-height: 1.45;
	}

	/* Report CTA */
	.report-section {
		padding-block: clamp(3.5rem, 7vw, 5rem);
		background: var(--c-bg-alt);
		border-top: 1px solid var(--c-border-site);
		border-bottom: 1px solid var(--c-border-site);
	}
	.report-inner {
		text-align: center;
		max-width: 600px;
	}
	.report-label {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		border: 1px solid var(--c-border-site);
		padding: 0.25rem 0.7rem;
		border-radius: 999px;
		margin-bottom: 1rem;
	}
	.report-heading {
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 4vw, 2.4rem);
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0 0 0.75rem;
	}
	.report-sub {
		font-size: 0.9rem;
		color: var(--c-fg-muted);
		line-height: 1.65;
		margin: 0 0 1.75rem;
	}
	.report-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	@media (min-width: 480px) {
		.report-form { flex-direction: row; }
	}
	.report-input {
		flex: 1;
		padding: 0.85rem 1rem;
		font-size: 0.9rem;
		font-family: var(--font-body);
		background: var(--c-bg);
		color: var(--c-fg);
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		outline: none;
		transition: border-color 0.15s;
		min-width: 0;
	}
	.report-input:focus { border-color: var(--c-fg); }
	.report-input::placeholder { color: var(--c-fg-muted); }
	.report-btn {
		padding: 0.85rem 1.5rem;
		font-size: 0.88rem;
		font-weight: 600;
		font-family: var(--font-body);
		background: var(--c-fg);
		color: var(--c-bg);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: opacity 0.15s;
		white-space: nowrap;
	}
	.report-btn:hover:not(:disabled) { opacity: 0.82; }
	.report-btn:disabled { opacity: 0.4; cursor: not-allowed; }
	.report-note {
		font-size: 0.76rem;
		color: var(--c-fg-muted);
		margin: 0.75rem 0 0;
	}
	.report-success {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		background: rgba(34, 197, 94, 0.07);
		border: 1px solid rgba(34, 197, 94, 0.3);
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		text-align: left;
	}
	.report-success svg { flex-shrink: 0; margin-top: 2px; }
	.report-success strong { display: block; color: var(--c-fg); font-size: 0.95rem; margin-bottom: 0.25rem; }
	.report-success p { font-size: 0.85rem; color: var(--c-fg-muted); margin: 0; }

	/* Agentic Browsing */
	.agentic-block {
		margin-bottom: 2rem;
		border: 1px solid var(--c-border-site);
		border-radius: 14px;
		padding: 1.5rem;
	}

	.agentic-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.agentic-head .block-sub { margin-bottom: 0; }

	.agentic-badge {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		border: 1px solid var(--c-border-site);
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		white-space: nowrap;
		flex-shrink: 0;
		margin-top: 0.2rem;
	}

	.agentic-score-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.25rem;
		flex-wrap: wrap;
	}

	.agentic-fraction {
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.04em;
		color: var(--c-fg);
		line-height: 1;
		flex-shrink: 0;
	}

	.agentic-denom {
		font-size: 1.1rem;
		color: var(--c-fg-muted);
	}

	.agentic-bar {
		flex: 1;
		height: 6px;
		background: var(--c-border-site);
		border-radius: 999px;
		overflow: hidden;
		min-width: 80px;
	}

	.agentic-bar-fill {
		height: 100%;
		background: var(--c-fg);
		border-radius: 999px;
		transition: width 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.agentic-score-label {
		font-size: 0.82rem;
		color: var(--c-fg-muted);
		white-space: nowrap;
	}

	.agentic-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.agentic-row {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.7rem 0;
		border-top: 1px solid var(--c-border-site);
	}

	.agentic-icon {
		flex-shrink: 0;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.72rem;
		font-weight: 700;
		margin-top: 1px;
	}

	.agentic-icon-pass { background: rgba(34, 197, 94, 0.12); color: #22c55e; }
	.agentic-icon-fail { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
	.agentic-icon-na   { background: var(--c-bg-alt); color: var(--c-fg-muted); }

	.agentic-audit-info {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.agentic-audit-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--c-fg);
		line-height: 1.3;
	}

	.agentic-audit-value {
		font-size: 0.78rem;
		color: var(--c-fg-muted);
	}

	/* FAQ */
	.faq-section {
		padding-block: clamp(4rem, 8vw, 6rem);
	}
	.faq-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.faq-item {
		border-bottom: 1px solid var(--c-border-site);
	}
	.faq-q {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		width: 100%;
		padding: 1.1rem 0;
		background: none;
		border: none;
		font-family: var(--font-body);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--c-fg);
		cursor: pointer;
		text-align: left;
		transition: color 0.15s;
	}
	.faq-q:hover { color: var(--c-fg-muted); }
	.faq-icon {
		flex-shrink: 0;
		transition: transform 0.2s ease;
	}
	.faq-q.open .faq-icon { transform: rotate(45deg); }
	.faq-a {
		font-size: 0.88rem;
		color: var(--c-fg-muted);
		line-height: 1.7;
		padding: 0 0 1.25rem;
		margin: 0;
	}
</style>
