<script>
	import { m } from '$lib/paraglide/messages.js';

	const EMAIL = 'recep@devrec.nl';

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let status = $state('idle');

	function handleSubmit(e) {
		e.preventDefault();
		const subject = encodeURIComponent(`Aanvraag van ${name}`);
		const body = encodeURIComponent(`Naam: ${name}\nE-mail: ${email}\n\n${message}`);
		window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
		status = 'sent';
	}
</script>

<section class="section" id="contact">
	<div class="section-inner">
		<span class="section-label">{m.contact_label()}</span>
		<h2 class="contact-heading">{m.contact_heading()}</h2>
		<p class="contact-subtext">{m.contact_subtext()}</p>

		<div class="contact-layout">
			<form class="contact-form" onsubmit={handleSubmit} novalidate>
				<div class="field">
					<label for="contact-name">{m.contact_name()}</label>
					<input
						id="contact-name"
						type="text"
						bind:value={name}
						required
						autocomplete="name"
					/>
				</div>

				<div class="field">
					<label for="contact-email">{m.contact_email()}</label>
					<input
						id="contact-email"
						type="email"
						bind:value={email}
						required
						autocomplete="email"
					/>
				</div>

				<div class="field">
					<label for="contact-message">{m.contact_message()}</label>
					<textarea
						id="contact-message"
						bind:value={message}
						rows="5"
						required
					></textarea>
				</div>

				<button type="submit" class="submit-btn">{m.contact_send()}</button>
			</form>

			<div class="contact-aside">
				<p class="contact-or">{m.contact_or()}</p>
				<a href="mailto:{EMAIL}" class="email-link">{EMAIL}</a>
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
		margin-bottom: 1rem;
	}

	.contact-heading {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5vw, 3.5rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 0 0 0.75rem 0;
	}

	.contact-subtext {
		font-size: 1rem;
		color: var(--c-fg-muted);
		margin: 0 0 3rem 0;
		max-width: 480px;
	}

	.contact-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
	}

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
	}

	input,
	textarea {
		background: transparent;
		border: 1px solid var(--c-border-site);
		border-radius: 6px;
		padding: 0.75rem 1rem;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--c-fg);
		transition: border-color 0.15s ease;
		resize: none;
	}

	input::placeholder,
	textarea::placeholder {
		color: var(--c-fg-muted);
		opacity: 0.5;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--c-fg);
	}

	.submit-btn {
		align-self: flex-start;
		background: var(--c-accent);
		color: var(--c-accent-inv);
		border: 1px solid var(--c-accent);
		padding: 0.75rem 1.75rem;
		font-family: var(--font-body);
		font-size: 0.9rem;
		font-weight: 600;
		border-radius: 6px;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.submit-btn:hover {
		opacity: 0.85;
	}

	.contact-aside {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;
	}

	.contact-or {
		font-size: 0.875rem;
		color: var(--c-fg-muted);
		margin: 0;
	}

	.email-link {
		font-size: 1rem;
		font-weight: 600;
		color: var(--c-fg);
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: opacity 0.15s ease;
	}

	.email-link:hover {
		opacity: 0.7;
	}

	@media (min-width: 768px) {
		.contact-layout {
			grid-template-columns: 1.5fr 1fr;
			align-items: start;
		}

		.contact-aside {
			padding-top: 0;
			border-left: 1px solid var(--c-border-site);
			padding-left: 3rem;
			min-height: 200px;
		}
	}
</style>
