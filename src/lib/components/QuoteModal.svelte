<script>
	import { m } from '$lib/paraglide/messages.js';
	import { quoteOpen, quoteService, closeQuote } from '$lib/stores/quote.js';
	import { onMount } from 'svelte';
	import Turnstile from '$lib/components/Turnstile.svelte';

	const EMAIL = 'recep@devrec.nl';
	const CALENDAR_EMBED_URL =
		'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2B17LOTJgvV0oY47byZDnoYXsVWE6-H0O5PqyaDIlftNdvCHFTFupV8uTXb0uktESDgRCDzfOS?gv=true';

	const BUDGET_OPTIONS = [
		'< €500',
		'€500 – €1.500',
		'€1.500 – €5.000',
		'€5.000 – €15.000',
		'> €15.000'
	];
	const TOTAL_STEPS = 4;

	let step = $state(1);
	let submitState = $state('idle'); // idle | loading | success | error
	let errors = $state({});
	let modalEl = $state(null);

	// Form data
	let selectedService = $state('');
	let company = $state('');
	let website = $state('');
	let need = $state('');
	let budget = $state('');
	let fullName = $state('');
	let email = $state('');
	let phone = $state('');
	let wantsMeeting = $state(null); // null | true | false
	let cfToken = $state('');
	let turnstileRef = $state(null);

	const services = $derived([
		{ key: 'web', label: m.service_1_title() },
		{ key: 'hosting', label: m.service_2_title() },
		{ key: 'shop', label: m.service_3_title() },
		{ key: 'optimization', label: m.service_4_title() },
		{ key: 'marketing', label: m.service_5_title() }
	]);

	const stepLabels = $derived([
		m.quote_step_1_label(),
		m.quote_step_2_label(),
		m.quote_step_3_label(),
		m.quote_step_4_label()
	]);

	// Sync from store when modal opens
	$effect(() => {
		if ($quoteOpen) {
			const svc = $quoteService;
			reset();
			if (svc) {
				selectedService = svc;
				step = 2;
			}
		}
	});

	// Body scroll lock + focus management
	$effect(() => {
		if ($quoteOpen) {
			document.body.style.overflow = 'hidden';
			requestAnimationFrame(() => {
				const first = modalEl?.querySelector('button:not([disabled]), input, textarea, select');
				first?.focus();
			});
		} else {
			document.body.style.overflow = '';
		}
	});

	onMount(() => {
		function onKeydown(e) {
			if (!$quoteOpen) return;
			if (e.key === 'Escape') {
				e.preventDefault();
				close();
				return;
			}
			if (e.key === 'Tab' && modalEl) {
				const nodes = [
					...modalEl.querySelectorAll(
						'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
					)
				];
				if (!nodes.length) return;
				const first = nodes[0],
					last = nodes[nodes.length - 1];
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		}
		document.addEventListener('keydown', onKeydown);
		return () => document.removeEventListener('keydown', onKeydown);
	});

	function close() {
		closeQuote();
		setTimeout(reset, 300);
	}

	function reset() {
		step = 1;
		submitState = 'idle';
		errors = {};
		selectedService = '';
		company = '';
		website = '';
		need = '';
		budget = '';
		fullName = '';
		email = '';
		phone = '';
		wantsMeeting = null;
		cfToken = '';
	}

	function back() {
		errors = {};
		if (step === 4) cfToken = '';
		step = Math.max(step - 1, 1);
	}

	function validate(s) {
		const e = {};
		if (s === 1 && !selectedService) e.service = m.quote_err_service();
		if (s === 2) {
			if (!company.trim()) e.company = m.quote_err_company();
			if (!need.trim()) e.need = m.quote_err_need();
		}
		if (s === 3) {
			if (!fullName.trim()) e.name = m.quote_err_name();
			if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
				e.email = m.quote_err_email();
		}
		return e;
	}

	function next() {
		const e = validate(step);
		if (Object.keys(e).length) {
			errors = e;
			return;
		}
		errors = {};
		step = Math.min(step + 1, TOTAL_STEPS);
	}

	async function submit() {
		// Re-validate step 3 in case user navigated back
		const e = validate(3);
		if (Object.keys(e).length) {
			step = 3;
			errors = e;
			return;
		}

		submitState = 'loading';

		const serviceLabel = services.find((s) => s.key === selectedService)?.label ?? selectedService;

		try {
			const res = await fetch('/api/quote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					service: serviceLabel,
					company,
					website,
					need,
					budget,
					fullName,
					email,
					phone,
					wantsMeeting,
					cfToken
				})
			});

			if (!res.ok) {
				submitState = 'error';
				return;
			}

			submitState = 'success';
		} catch {
			submitState = 'error';
		}
	}
</script>

{#if $quoteOpen}
	<div class="backdrop" onclick={close} aria-hidden="true"></div>

	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		bind:this={modalEl}
	>
		<!-- Header -->
		<div class="modal-header">
			<span id="modal-title" class="modal-title-text">{m.quote_modal_title()}</span>
			<button class="close-btn" onclick={close} aria-label={m.quote_close()}>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>

		<!-- Step indicator -->
		{#if submitState === 'idle' || submitState === 'loading'}
			<div class="step-track" aria-label="Stap {step} van {TOTAL_STEPS}">
				{#each stepLabels as label, i}
					<div class="step-item" class:is-active={step === i + 1} class:is-done={step > i + 1}>
						<div class="step-num" aria-hidden="true">
							{#if step > i + 1}
								<svg
									width="10"
									height="10"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg
								>
							{:else}
								{i + 1}
							{/if}
						</div>
						<span class="step-label">{label}</span>
					</div>
					{#if i < TOTAL_STEPS - 1}
						<div class="step-line" class:is-done={step > i + 1} aria-hidden="true"></div>
					{/if}
				{/each}
			</div>
		{/if}

		<!-- Body -->
		<div class="modal-body">
			<!-- ── Success ── -->
			{#if submitState === 'success'}
				<div class="state-screen">
					<div class="state-icon state-icon-success" aria-hidden="true">
						<svg
							width="26"
							height="26"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
						</svg>
					</div>
					<h2 class="state-title">{m.quote_success_title()}</h2>
					<p class="state-sub">{m.quote_success_sub({ email })}</p>
					{#if wantsMeeting === true}
						<p class="state-meeting-prompt">{m.quote_success_meeting()}</p>
						<div class="calendar-embed">
							<iframe
								src={CALENDAR_EMBED_URL}
								title="Plan een kennismakingsgesprek"
								style="border: 0"
								width="100%"
								height="600"
								frameborder="0"
							></iframe>
						</div>
					{/if}
					<button class="btn-close-success" onclick={close}>{m.quote_close()}</button>
				</div>

				<!-- ── Error ── -->
			{:else if submitState === 'error'}
				<div class="state-screen">
					<div class="state-icon state-icon-error" aria-hidden="true">
						<svg
							width="26"
							height="26"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line
								x1="9"
								y1="9"
								x2="15"
								y2="15"
							/>
						</svg>
					</div>
					<h2 class="state-title">{m.quote_error_title()}</h2>
					<p class="state-sub">{m.quote_error_sub()}</p>
					<div class="error-actions">
						<a href="mailto:{EMAIL}" class="btn-primary-action">{m.quote_error_email_btn()}</a>
						<button
							class="btn-ghost"
							onclick={() => {
								submitState = 'idle';
							}}>{m.quote_error_retry()}</button
						>
					</div>
				</div>

				<!-- ── Step 1: Service ── -->
			{:else if step === 1}
				<div class="step-content">
					<h2 class="step-heading">{m.quote_s1_heading()}</h2>
					<p class="step-sub">{m.quote_s1_sub()}</p>

					{#if errors.service}
						<p class="field-error" role="alert">{errors.service}</p>
					{/if}

					<div class="service-grid">
						{#each services as svc, i}
							<button
								class="service-card"
								class:is-selected={selectedService === svc.key}
								onclick={() => {
									selectedService = svc.key;
									errors = {};
								}}
								type="button"
							>
								<span class="svc-num" aria-hidden="true">0{i + 1}</span>
								<span class="svc-label">{svc.label}</span>
								<span class="svc-check" aria-hidden="true">
									{#if selectedService === svc.key}
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg
										>
									{/if}
								</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- ── Step 2: Company ── -->
			{:else if step === 2}
				<div class="step-content">
					<h2 class="step-heading">{m.quote_s2_heading()}</h2>
					<p class="step-sub">{m.quote_s2_sub()}</p>

					<div class="fields">
						<div class="field">
							<label for="q-company"
								>{m.quote_s2_company()} <span class="req" aria-hidden="true">*</span></label
							>
							<input
								id="q-company"
								type="text"
								bind:value={company}
								class:is-invalid={errors.company}
								autocomplete="organization"
								oninput={() => {
									if (errors.company) errors = { ...errors, company: '' };
								}}
							/>
							{#if errors.company}<span class="field-error" role="alert">{errors.company}</span
								>{/if}
						</div>

						<div class="field">
							<label for="q-website">{m.quote_s2_website()}</label>
							<input
								id="q-website"
								type="url"
								bind:value={website}
								placeholder="https://"
								autocomplete="url"
							/>
						</div>

						<div class="field">
							<label for="q-need"
								>{m.quote_s2_need()} <span class="req" aria-hidden="true">*</span></label
							>
							<textarea
								id="q-need"
								bind:value={need}
								rows="4"
								placeholder={m.quote_s2_need_ph()}
								class:is-invalid={errors.need}
								oninput={() => {
									if (errors.need) errors = { ...errors, need: '' };
								}}
							></textarea>
							{#if errors.need}<span class="field-error" role="alert">{errors.need}</span>{/if}
						</div>

						<div class="field">
							<label for="q-budget">{m.quote_s2_budget_label()}</label>
							<select id="q-budget" bind:value={budget}>
								<option value="">{m.quote_s2_budget_unknown()}</option>
								{#each BUDGET_OPTIONS as opt}
									<option value={opt}>{opt}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>

				<!-- ── Step 3: Contact ── -->
			{:else if step === 3}
				<div class="step-content">
					<h2 class="step-heading">{m.quote_s3_heading()}</h2>
					<p class="step-sub">{m.quote_s3_sub()}</p>

					<div class="fields">
						<div class="field">
							<label for="q-name"
								>{m.quote_s3_name()} <span class="req" aria-hidden="true">*</span></label
							>
							<input
								id="q-name"
								type="text"
								bind:value={fullName}
								class:is-invalid={errors.name}
								autocomplete="name"
								oninput={() => {
									if (errors.name) errors = { ...errors, name: '' };
								}}
							/>
							{#if errors.name}<span class="field-error" role="alert">{errors.name}</span>{/if}
						</div>

						<div class="field">
							<label for="q-email"
								>{m.quote_s3_email()} <span class="req" aria-hidden="true">*</span></label
							>
							<input
								id="q-email"
								type="email"
								bind:value={email}
								class:is-invalid={errors.email}
								autocomplete="email"
								oninput={() => {
									if (errors.email) errors = { ...errors, email: '' };
								}}
							/>
							{#if errors.email}<span class="field-error" role="alert">{errors.email}</span>{/if}
						</div>

						<div class="field">
							<label for="q-phone">{m.quote_s3_phone()}</label>
							<input id="q-phone" type="tel" bind:value={phone} autocomplete="tel" />
						</div>
					</div>
				</div>

				<!-- ── Step 4: Meeting ── -->
			{:else if step === 4}
				<div class="step-content">
					<h2 class="step-heading">{m.quote_s4_heading()}</h2>
					<p class="step-sub">{m.quote_s4_sub()}</p>

					<div class="meeting-options">
						<button
							class="meeting-opt"
							class:is-selected={wantsMeeting === true}
							type="button"
							onclick={() => (wantsMeeting = true)}
						>
							<div class="meeting-radio" aria-hidden="true">
								{#if wantsMeeting === true}<span class="radio-dot"></span>{/if}
							</div>
							{m.quote_s4_yes()}
						</button>
						<button
							class="meeting-opt"
							class:is-selected={wantsMeeting === false}
							type="button"
							onclick={() => (wantsMeeting = false)}
						>
							<div class="meeting-radio" aria-hidden="true">
								{#if wantsMeeting === false}<span class="radio-dot"></span>{/if}
							</div>
							{m.quote_s4_no()}
						</button>
					</div>

					{#if wantsMeeting === true}
						<div class="calendar-embed">
							<iframe
								src={CALENDAR_EMBED_URL}
								title="Plan een kennismakingsgesprek"
								style="border: 0"
								width="100%"
								height="600"
								frameborder="0"
							></iframe>
						</div>
					{/if}

					<Turnstile
						bind:this={turnstileRef}
						onVerify={(t) => (cfToken = t)}
						onExpire={() => (cfToken = '')}
						onError={() => (cfToken = '')}
					/>
				</div>
			{/if}
		</div>

		<!-- Footer nav (only during form steps) -->
		{#if submitState === 'idle' || submitState === 'loading'}
			<div class="modal-footer">
				{#if step > 1}
					<button class="btn-back" onclick={back} disabled={submitState === 'loading'}>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
						</svg>
						{m.quote_back()}
					</button>
				{:else}
					<div></div>
				{/if}

				{#if step < TOTAL_STEPS}
					<button class="btn-next" onclick={next}>
						{m.quote_next()}
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
						</svg>
					</button>
				{:else}
					<button
						class="btn-submit"
						onclick={submit}
						disabled={submitState === 'loading' || !cfToken}
					>
						{#if submitState === 'loading'}
							<span class="spinner" aria-hidden="true"></span>
						{:else}
							{m.quote_submit()}
						{/if}
					</button>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Backdrop */
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		z-index: 9998;
		animation: fade-in 0.2s ease;
	}

	[data-theme='dark'] .backdrop {
		background: rgba(0, 0, 0, 0.72);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Modal */
	.modal {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		background: var(--c-bg);
		border: 1px solid var(--c-border-site);
		overflow: hidden;
		animation: modal-in 0.22s cubic-bezier(0.22, 1, 0.36, 1);
	}

	@media (min-width: 600px) {
		.modal {
			inset: auto;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: calc(100% - 2rem);
			max-width: 660px;
			max-height: calc(100dvh - 2rem);
			border-radius: 16px;
		}
	}

	@keyframes modal-in {
		from {
			opacity: 0;
			transform: translate(-50%, calc(-50% + 16px)) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	}

	/* On mobile, slide up from bottom */
	@media (max-width: 599px) {
		@keyframes modal-in {
			from {
				opacity: 0;
				transform: translateY(24px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}
	}

	/* Header */
	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--c-border-site);
		flex-shrink: 0;
	}

	.modal-title-text {
		font-family: var(--font-heading);
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--c-fg);
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 8px;
		border: 1px solid var(--c-border-site);
		background: none;
		color: var(--c-fg-muted);
		cursor: pointer;
		transition:
			color 0.15s,
			border-color 0.15s;
		flex-shrink: 0;
	}

	.close-btn:hover {
		color: var(--c-fg);
		border-color: var(--c-fg);
	}

	/* Step track */
	.step-track {
		display: flex;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--c-border-site);
		gap: 0;
		flex-shrink: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.step-track::-webkit-scrollbar {
		display: none;
	}

	.step-item {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex-shrink: 0;
	}

	.step-num {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 1.5px solid var(--c-border-site);
		background: var(--c-bg);
		color: var(--c-fg-muted);
		font-size: 0.68rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.step-item.is-active .step-num {
		border-color: var(--c-fg);
		background: var(--c-fg);
		color: var(--c-bg);
	}

	.step-item.is-done .step-num {
		border-color: var(--c-fg);
		background: var(--c-fg);
		color: var(--c-bg);
	}

	.step-label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--c-fg-muted);
		white-space: nowrap;
		transition: color 0.2s;
	}

	.step-item.is-active .step-label,
	.step-item.is-done .step-label {
		color: var(--c-fg);
	}

	.step-line {
		flex: 1;
		min-width: 1rem;
		height: 1px;
		background: var(--c-border-site);
		margin: 0 0.4rem;
		transition: background 0.2s;
	}

	.step-line.is-done {
		background: var(--c-fg);
	}

	/* Body */
	.modal-body {
		flex: 1;
		overflow-y: auto;
		padding: 1.75rem 1.5rem;
	}

	/* State screens */
	.state-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 1.5rem 0;
		gap: 0.75rem;
	}

	.state-icon {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.5rem;
	}

	.state-icon-success {
		background: rgba(34, 197, 94, 0.1);
		color: #22c55e;
	}
	.state-icon-error {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	.state-title {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0;
	}

	.state-sub {
		font-size: 0.9rem;
		color: var(--c-fg-muted);
		line-height: 1.6;
		margin: 0;
		max-width: 340px;
	}

	.state-meeting-prompt {
		font-size: 0.85rem;
		color: var(--c-fg-muted);
		margin: 0.5rem 0 0;
	}

	.btn-close-success {
		margin-top: 0.5rem;
		background: none;
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		padding: 0.6rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		font-family: var(--font-body);
		color: var(--c-fg-muted);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.btn-close-success:hover {
		border-color: var(--c-fg);
		color: var(--c-fg);
	}

	.error-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.5rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.btn-primary-action {
		background: var(--c-fg);
		color: var(--c-bg);
		border: 1px solid var(--c-fg);
		border-radius: 8px;
		padding: 0.65rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		font-family: var(--font-body);
		text-decoration: none;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.btn-primary-action:hover {
		opacity: 0.82;
	}

	.btn-ghost {
		background: none;
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		padding: 0.65rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		font-family: var(--font-body);
		color: var(--c-fg-muted);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.btn-ghost:hover {
		border-color: var(--c-fg);
		color: var(--c-fg);
	}

	/* Step content */
	.step-content {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.step-heading {
		font-family: var(--font-heading);
		font-size: clamp(1.2rem, 4vw, 1.5rem);
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0;
		line-height: 1.2;
	}

	.step-sub {
		font-size: 0.875rem;
		color: var(--c-fg-muted);
		line-height: 1.6;
		margin: -0.75rem 0 0;
	}

	/* Service grid */
	.service-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}

	.service-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
		padding: 1rem;
		background: var(--c-bg);
		border: 1px solid var(--c-border-site);
		border-radius: 10px;
		cursor: pointer;
		text-align: left;
		transition:
			border-color 0.15s,
			background 0.15s;
		font-family: var(--font-body);
		position: relative;
	}

	.service-card:hover {
		border-color: var(--c-fg);
		background: var(--c-bg-alt);
	}

	.service-card.is-selected {
		border-color: var(--c-fg);
		background: var(--c-bg-alt);
	}

	.svc-num {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--c-fg-muted);
	}

	.svc-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--c-fg);
		line-height: 1.3;
	}

	.svc-check {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--c-fg);
		color: var(--c-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.service-card.is-selected .svc-check {
		opacity: 1;
	}

	/* Fields */
	.fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.fields-row {
		flex-direction: row;
		gap: 0.75rem;
	}

	.fields-row .field {
		flex: 1;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	label {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
	}

	.req {
		color: var(--c-fg);
	}

	input,
	textarea,
	select {
		background: var(--c-bg-alt);
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		padding: 0.7rem 0.9rem;
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--c-fg);
		outline: none;
		transition: border-color 0.15s;
		resize: none;
		width: 100%;
		box-sizing: border-box;
		appearance: auto;
	}

	input:focus,
	textarea:focus,
	select:focus {
		border-color: var(--c-fg);
	}

	input::placeholder,
	textarea::placeholder {
		color: var(--c-fg-muted);
		opacity: 0.6;
	}

	input.is-invalid,
	textarea.is-invalid {
		border-color: #ef4444;
	}

	.field-error {
		display: block;
		font-size: 0.78rem;
		color: #ef4444;
		margin-top: 0.1rem;
	}

	/* Calendar embed */
	.calendar-embed {
		margin-top: 1rem;
		border-radius: 10px;
		overflow: hidden;
		border: 1px solid var(--c-border-site);
		background: #ffffff;
	}

	.calendar-embed iframe {
		display: block;
		background: #ffffff;
	}

	/* Meeting options */
	.meeting-options {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.meeting-opt {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding: 0.9rem 1rem;
		border: 1px solid var(--c-border-site);
		border-radius: 10px;
		background: var(--c-bg);
		cursor: pointer;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--c-fg);
		text-align: left;
		transition:
			border-color 0.15s,
			background 0.15s;
	}

	.meeting-opt:hover {
		border-color: var(--c-fg);
		background: var(--c-bg-alt);
	}
	.meeting-opt.is-selected {
		border-color: var(--c-fg);
		background: var(--c-bg-alt);
	}

	.meeting-radio {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1.5px solid var(--c-border-site);
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: border-color 0.15s;
	}

	.meeting-opt.is-selected .meeting-radio {
		border-color: var(--c-fg);
	}

	.radio-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--c-fg);
	}

	.meeting-details {
		margin-top: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.meeting-or {
		font-size: 0.78rem;
		color: var(--c-fg-muted);
		text-align: center;
		margin: 0.25rem 0 -0.1rem;
	}

	/* Calendar button */
	.calendar-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: var(--c-fg);
		color: var(--c-bg);
		border: 1px solid var(--c-fg);
		border-radius: 8px;
		padding: 0.7rem 1.25rem;
		font-size: 0.875rem;
		font-weight: 600;
		font-family: var(--font-body);
		text-decoration: none;
		cursor: pointer;
		transition: opacity 0.15s;
		text-align: center;
	}

	.calendar-btn:hover {
		opacity: 0.82;
	}

	/* Footer nav */
	.modal-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--c-border-site);
		flex-shrink: 0;
		gap: 0.75rem;
	}

	.btn-back {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: none;
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		padding: 0.65rem 1.1rem;
		font-size: 0.875rem;
		font-weight: 600;
		font-family: var(--font-body);
		color: var(--c-fg-muted);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.btn-back:hover:not(:disabled) {
		border-color: var(--c-fg);
		color: var(--c-fg);
	}
	.btn-back:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn-next {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: var(--c-fg);
		color: var(--c-bg);
		border: 1px solid var(--c-fg);
		border-radius: 8px;
		padding: 0.65rem 1.25rem;
		font-size: 0.875rem;
		font-weight: 600;
		font-family: var(--font-body);
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.btn-next:hover {
		opacity: 0.82;
	}

	.btn-submit {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: var(--c-fg);
		color: var(--c-bg);
		border: 1px solid var(--c-fg);
		border-radius: 8px;
		padding: 0.65rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		font-family: var(--font-body);
		cursor: pointer;
		transition: opacity 0.15s;
		min-width: 140px;
	}

	.btn-submit:hover:not(:disabled) {
		opacity: 0.82;
	}
	.btn-submit:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.spinner {
		width: 15px;
		height: 15px;
		border: 2px solid var(--c-bg);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
