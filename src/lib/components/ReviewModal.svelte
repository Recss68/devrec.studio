<script>
	import { invalidateAll } from '$app/navigation';
	import Turnstile from '$lib/components/Turnstile.svelte';

	/** @type {{ open?: boolean, onclose?: () => void }} */
	const { open = false, onclose } = $props();

	let step = $state('form'); // 'form' | 'verify' | 'success'
	let loading = $state(false);
	let errorMsg = $state('');

	let authorName = $state('');
	let email = $state('');
	let rating = $state(5);
	let hoverRating = $state(0);
	let text = $state('');

	let code = $state('');
	let token = $state('');
	let cfToken = $state('');
	let turnstileRef = $state(null);

	const activeRating = $derived(hoverRating || rating);

	async function requestCode() {
		if (!authorName.trim() || !text.trim() || !email.trim()) {
			errorMsg = 'Vul alle velden in.';
			return;
		}
		if (!cfToken) {
			errorMsg = 'Wacht even tot de captcha is geladen.';
			return;
		}
		loading = true;
		errorMsg = '';
		try {
			const res = await fetch('/api/review/send-code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.trim(), cfToken })
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				errorMsg = data.error ?? 'Verzenden mislukt.';
				return;
			}
			token = data.token;
			step = 'verify';
		} catch {
			errorMsg = 'Er is een fout opgetreden. Probeer het opnieuw.';
		} finally {
			loading = false;
		}
	}

	async function submitReview() {
		if (!code.trim()) {
			errorMsg = 'Voer de verificatiecode in.';
			return;
		}
		loading = true;
		errorMsg = '';
		try {
			const res = await fetch('/api/review/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					token,
					code: code.trim(),
					authorName: authorName.trim(),
					rating,
					text: text.trim()
				})
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				errorMsg = data.error ?? 'Er ging iets mis.';
				return;
			}
			step = 'success';
			invalidateAll();
		} catch {
			errorMsg = 'Er is een fout opgetreden. Probeer het opnieuw.';
		} finally {
			loading = false;
		}
	}

	function handleClose() {
		onclose?.();
		setTimeout(() => {
			step = 'form';
			authorName = '';
			email = '';
			text = '';
			code = '';
			token = '';
			cfToken = '';
			errorMsg = '';
			rating = 5;
			hoverRating = 0;
			loading = false;
		}, 300);
	}

	function backToForm() {
		step = 'form';
		code = '';
		errorMsg = '';
	}
</script>

{#if open}
	<div class="backdrop" onclick={handleClose} role="presentation" aria-hidden="true"></div>

	<div class="modal" role="dialog" aria-modal="true" aria-label="Review plaatsen">
		<button class="close-btn" onclick={handleClose} aria-label="Sluiten">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>

		{#if step === 'form'}
			<h2 class="modal-title">Schrijf een review</h2>
			<p class="modal-sub">Deel jouw ervaring met devrec.</p>

			<div class="form-group">
				<label for="rv-name">Naam</label>
				<input
					id="rv-name"
					type="text"
					bind:value={authorName}
					placeholder="Jouw naam"
					autocomplete="name"
				/>
			</div>

			<div class="form-group">
				<span class="label">Beoordeling</span>
				<div class="stars-input" role="group" aria-label="Kies een beoordeling van 1 tot 5 sterren">
					{#each [1, 2, 3, 4, 5] as n}
						<button
							type="button"
							class="star-btn"
							class:active={n <= activeRating}
							onmouseenter={() => (hoverRating = n)}
							onmouseleave={() => (hoverRating = 0)}
							onclick={() => (rating = n)}
							aria-label="{n} ster{n !== 1 ? 'ren' : ''}"
							aria-pressed={n <= rating}
						>
							<svg
								width="30"
								height="30"
								viewBox="0 0 24 24"
								fill={n <= activeRating ? 'currentColor' : 'none'}
								stroke="currentColor"
								stroke-width="1.5"
								aria-hidden="true"
							>
								<polygon
									points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
								/>
							</svg>
						</button>
					{/each}
				</div>
			</div>

			<div class="form-group">
				<label for="rv-text">Jouw review</label>
				<textarea id="rv-text" bind:value={text} placeholder="Vertel over jouw ervaring..." rows="4"
				></textarea>
			</div>

			<div class="form-group">
				<label for="rv-email">
					E-mailadres
					<span class="label-note">voor verificatie, niet zichtbaar op de site</span>
				</label>
				<input
					id="rv-email"
					type="email"
					bind:value={email}
					placeholder="jouw@email.nl"
					autocomplete="email"
				/>
			</div>

			<Turnstile
				bind:this={turnstileRef}
				onVerify={(t) => (cfToken = t)}
				onExpire={() => (cfToken = '')}
				onError={() => (cfToken = '')}
			/>

			{#if errorMsg}
				<p class="error-msg">{errorMsg}</p>
			{/if}

			<button class="primary-btn" onclick={requestCode} disabled={loading || !cfToken}>
				{#if loading}
					<span class="spinner" aria-hidden="true"></span>
					Bezig...
				{:else}
					Stuur verificatiecode
				{/if}
			</button>
		{:else if step === 'verify'}
			<h2 class="modal-title">Bevestig je review</h2>
			<p class="modal-sub">
				We hebben een 6-cijferige code verstuurd naar <strong>{email}</strong>. Voer hem hieronder
				in om je review te plaatsen.
			</p>

			<div class="form-group">
				<label for="rv-code">Verificatiecode</label>
				<input
					id="rv-code"
					type="text"
					inputmode="numeric"
					maxlength="6"
					bind:value={code}
					placeholder="123456"
					class="code-input"
					autocomplete="one-time-code"
				/>
			</div>

			{#if errorMsg}
				<p class="error-msg">{errorMsg}</p>
			{/if}

			<div class="row-actions">
				<button class="ghost-btn" onclick={backToForm} disabled={loading}>Terug</button>
				<button class="primary-btn" onclick={submitReview} disabled={loading}>
					{#if loading}
						<span class="spinner" aria-hidden="true"></span>
						Bezig...
					{:else}
						Review plaatsen
					{/if}
				</button>
			</div>
		{:else}
			<div class="success-state">
				<div class="success-icon" aria-hidden="true">
					<svg
						width="44"
						height="44"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="9 12 11 14 15 10" />
					</svg>
				</div>
				<h2 class="modal-title">Review geplaatst!</h2>
				<p class="modal-sub">
					Bedankt, {authorName}. Je review is ontvangen en wordt binnenkort zichtbaar.
				</p>
				<button class="primary-btn" onclick={handleClose}>Sluiten</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
	}

	.modal {
		position: fixed;
		inset: 0;
		z-index: 201;
		margin: auto;
		width: min(92vw, 480px);
		height: fit-content;
		max-height: 90vh;
		overflow-y: auto;
		background: var(--c-bg);
		border: 1px solid var(--c-border-site);
		border-radius: 16px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0;
		scrollbar-width: none;
	}

	.modal::-webkit-scrollbar {
		display: none;
	}

	.close-btn {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		background: none;
		border: none;
		padding: 0.3rem;
		color: var(--c-fg-muted);
		cursor: pointer;
		border-radius: 6px;
		display: flex;
		transition:
			color 0.15s,
			background 0.15s;
	}

	.close-btn:hover {
		color: var(--c-fg);
		background: var(--c-bg-alt);
	}

	.modal-title {
		font-family: var(--font-heading);
		font-size: clamp(1.4rem, 4vw, 1.8rem);
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0 0 0.35rem 0;
		padding-right: 2rem;
		line-height: 1.15;
	}

	.modal-sub {
		font-size: 0.9rem;
		color: var(--c-fg-muted);
		margin: 0 0 1.75rem 0;
		line-height: 1.55;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-bottom: 1.1rem;
	}

	label,
	.label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--c-fg);
		letter-spacing: 0.02em;
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.label-note {
		font-weight: 400;
		font-size: 0.75rem;
		color: var(--c-fg-muted);
	}

	input,
	textarea {
		width: 100%;
		background: var(--c-bg-alt);
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		padding: 0.65rem 0.85rem;
		font-size: 0.9rem;
		color: var(--c-fg);
		font-family: inherit;
		transition: border-color 0.15s;
		box-sizing: border-box;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--c-fg);
	}

	input::placeholder,
	textarea::placeholder {
		color: var(--c-fg-muted);
		opacity: 0.6;
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	.code-input {
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: 0.3em;
		text-align: center;
		padding: 0.85rem;
	}

	.stars-input {
		display: flex;
		gap: 0.2rem;
	}

	.star-btn {
		background: none;
		border: none;
		padding: 0.1rem;
		cursor: pointer;
		color: var(--c-border-site);
		transition:
			color 0.1s,
			transform 0.1s;
		display: flex;
	}

	.star-btn.active {
		color: var(--c-fg);
	}

	.star-btn:hover {
		transform: scale(1.1);
	}

	.error-msg {
		font-size: 0.82rem;
		color: #e53e3e;
		margin: 0 0 0.75rem 0;
		padding: 0.6rem 0.85rem;
		background: rgba(229, 62, 62, 0.08);
		border-radius: 6px;
		border: 1px solid rgba(229, 62, 62, 0.2);
	}

	.primary-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.8rem 1.25rem;
		background: var(--c-fg);
		color: var(--c-bg);
		border: none;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s;
		font-family: inherit;
		margin-top: 0.25rem;
	}

	.primary-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.primary-btn:not(:disabled):hover {
		opacity: 0.85;
	}

	.ghost-btn {
		padding: 0.8rem 1.25rem;
		background: none;
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--c-fg-muted);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
		font-family: inherit;
	}

	.ghost-btn:hover:not(:disabled) {
		border-color: var(--c-fg);
		color: var(--c-fg);
	}

	.row-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.25rem;
	}

	.row-actions .primary-btn {
		flex: 1;
		margin-top: 0;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.success-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.5rem;
		padding: 1rem 0;
	}

	.success-icon {
		color: var(--c-fg);
		margin-bottom: 0.5rem;
	}

	.success-state .modal-sub {
		margin-bottom: 1.5rem;
	}

	.success-state .primary-btn {
		width: auto;
		padding: 0.75rem 2rem;
	}
</style>
