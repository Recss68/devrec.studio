<script>
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale, setLocale } from '$lib/paraglide/runtime.js';

	let menuOpen = $state(false);
	let theme = $state('light');
	let locale = $state('nl');
	let scrolled = $state(false);

	onMount(() => {
		// Read what app.html's inline script already applied — avoids duplicate logic
		theme = (document.documentElement.getAttribute('data-theme') ?? 'light');

		// Follow OS preference changes live (only when user has no manual override)
		const mql = window.matchMedia('(prefers-color-scheme: dark)');
		const onSystemChange = (e) => {
			if (!localStorage.getItem('devrec-theme')) {
				theme = e.matches ? 'dark' : 'light';
				document.documentElement.setAttribute('data-theme', theme);
			}
		};
		mql.addEventListener('change', onSystemChange);

		try {
			locale = getLocale();
		} catch {
			locale = 'nl';
		}

		const onScroll = () => (scrolled = window.scrollY > 20);
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', onScroll);
			mql.removeEventListener('change', onSystemChange);
		};
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('devrec-theme', theme);
	}

	function switchLocale(l) {
		setLocale(l);
	}

	function openMenu() {
		menuOpen = true;
		document.body.style.overflow = 'hidden';
	}

	function closeMenu() {
		menuOpen = false;
		document.body.style.overflow = '';
	}

	const navLinks = [
		{ key: 'nav_about', href: '#over-mij' },
		{ key: 'nav_services', href: '#diensten' },
		{ key: 'nav_portfolio', href: '/portfolio' },
		{ key: 'nav_contact', href: '#contact' }
	];

	function getLinkLabel(key) {
		if (key === 'nav_about') return m.nav_about();
		if (key === 'nav_services') return m.nav_services();
		if (key === 'nav_portfolio') return m.nav_portfolio();
		return m.nav_contact();
	}
</script>

<header class:scrolled>
	<div class="header-inner">
		<a href="/" class="logo" aria-label="devrec home">
			devrec<span class="logo-dot">.</span>
		</a>

		<nav class="desktop-nav" aria-label="Hoofdnavigatie">
			{#each navLinks as link}
				<a href={link.href} class="nav-link">{getLinkLabel(link.key)}</a>
			{/each}
		</nav>

		<div class="controls">
			<div class="lang-toggle" role="group" aria-label="Taal kiezen">
				<button
					class="lang-btn"
					class:active={locale === 'nl'}
					onclick={() => switchLocale('nl')}
					aria-pressed={locale === 'nl'}
				>
					NL
				</button>
				<span class="lang-sep" aria-hidden="true">/</span>
				<button
					class="lang-btn"
					class:active={locale === 'en'}
					onclick={() => switchLocale('en')}
					aria-pressed={locale === 'en'}
				>
					EN
				</button>
			</div>

			<button
				class="theme-btn"
				onclick={toggleTheme}
				aria-label={theme === 'light' ? 'Schakel naar donker thema' : 'Schakel naar licht thema'}
			>
				{#if theme === 'light'}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
					</svg>
				{:else}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<circle cx="12" cy="12" r="5" />
						<line x1="12" y1="1" x2="12" y2="3" />
						<line x1="12" y1="21" x2="12" y2="23" />
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
						<line x1="1" y1="12" x2="3" y2="12" />
						<line x1="21" y1="12" x2="23" y2="12" />
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
					</svg>
				{/if}
			</button>

			<button
				class="menu-btn"
				onclick={menuOpen ? closeMenu : openMenu}
				aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
				aria-expanded={menuOpen}
			>
				{#if menuOpen}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				{:else}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<line x1="3" y1="6" x2="21" y2="6" />
						<line x1="3" y1="12" x2="21" y2="12" />
						<line x1="3" y1="18" x2="21" y2="18" />
					</svg>
				{/if}
			</button>
		</div>
	</div>
</header>

<!-- Full-screen mobile nav overlay -->
<nav
	class="mobile-nav"
	class:open={menuOpen}
	aria-hidden={!menuOpen}
	aria-label="Mobiele navigatie"
>
	<div class="mobile-nav-top">
		<a href="/" class="mobile-logo" onclick={closeMenu} aria-label="devrec home">
			devrec<span class="logo-dot">.</span>
		</a>
		<button class="mobile-close-btn" onclick={closeMenu} aria-label="Menu sluiten">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>
	</div>

	<ul class="mobile-nav-links">
		{#each navLinks as link, i}
			<li class="mobile-nav-item" style="--i: {i}">
				<a
					href={link.href}
					class="mobile-nav-link"
					onclick={closeMenu}
					tabindex={menuOpen ? 0 : -1}
				>
					{getLinkLabel(link.key)}
				</a>
			</li>
		{/each}
	</ul>

	<div class="mobile-nav-footer">
		<div class="mobile-lang-toggle" role="group" aria-label="Taal kiezen">
			<button
				class="mobile-lang-btn"
				class:active={locale === 'nl'}
				onclick={() => { switchLocale('nl'); closeMenu(); }}
				tabindex={menuOpen ? 0 : -1}
			>NL</button>
			<span aria-hidden="true">/</span>
			<button
				class="mobile-lang-btn"
				class:active={locale === 'en'}
				onclick={() => { switchLocale('en'); closeMenu(); }}
				tabindex={menuOpen ? 0 : -1}
			>EN</button>
		</div>
	</div>
</nav>

<!-- Backdrop -->
<div
	class="nav-backdrop"
	class:visible={menuOpen}
	onclick={closeMenu}
	aria-hidden="true"
></div>

<style>
	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: var(--header-bg);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	header.scrolled {
		border-bottom-color: var(--c-border-site);
	}

	.header-inner {
		max-width: 1280px;
		margin-inline: auto;
		padding: 1.25rem clamp(1rem, 4vw, 2rem);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.logo {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		letter-spacing: -0.02em;
		color: var(--c-fg);
		line-height: 1;
		position: relative;
		z-index: 101;
	}

	.logo-dot {
		color: var(--c-fg-muted);
	}

	.desktop-nav {
		display: none;
		gap: 2rem;
	}

	.nav-link {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--c-fg-muted);
		letter-spacing: 0.02em;
		transition: color 0.15s ease;
	}

	.nav-link:hover {
		color: var(--c-fg);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		position: relative;
		z-index: 101;
	}

	.lang-toggle {
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}

	.lang-sep {
		font-size: 0.75rem;
		color: var(--c-border-site);
	}

	.lang-btn {
		background: none;
		border: none;
		padding: 0.25rem 0.1rem;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		color: var(--c-fg-muted);
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.lang-btn.active {
		color: var(--c-fg);
	}

	.lang-btn:hover {
		color: var(--c-fg);
	}

	.theme-btn {
		background: none;
		border: none;
		padding: 0.4rem;
		color: var(--c-fg-muted);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		transition: color 0.15s ease, background 0.15s ease;
	}

	.theme-btn:hover {
		color: var(--c-fg);
		background: var(--c-bg-alt);
	}

	.menu-btn {
		background: none;
		border: none;
		padding: 0.4rem;
		color: var(--c-fg);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		transition: background 0.15s ease;
	}

	.menu-btn:hover {
		background: var(--c-bg-alt);
	}

	/* ── Full-screen slide-in nav ── */
	.mobile-nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--c-bg);
		z-index: 99;
		transform: translateX(-100%);
		transition: transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		display: flex;
		flex-direction: column;
		padding: 0 clamp(1.5rem, 6vw, 3rem) clamp(2rem, 5vw, 3rem);
		overflow-y: auto;
	}

	.mobile-nav.open {
		transform: translateX(0);
	}

	.mobile-nav-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-block: 1.35rem;
		border-bottom: 1px solid var(--c-border-site);
		margin-bottom: 2.5rem;
	}

	.mobile-logo {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		letter-spacing: -0.02em;
		color: var(--c-fg);
		line-height: 1;
	}

	.mobile-close-btn {
		background: none;
		border: none;
		padding: 0.4rem;
		color: var(--c-fg);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		transition: background 0.15s ease;
	}

	.mobile-close-btn:hover {
		background: var(--c-bg-alt);
	}

	.mobile-nav-links {
		list-style: none;
		margin: 0;
		padding: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0;
	}

	.mobile-nav-item {
		border-bottom: 1px solid var(--c-border-site);
		opacity: 0;
		transform: translateX(-1.5rem);
		transition:
			opacity 0.3s ease calc(var(--i) * 0.06s + 0.1s),
			transform 0.3s ease calc(var(--i) * 0.06s + 0.1s);
	}

	.mobile-nav.open .mobile-nav-item {
		opacity: 1;
		transform: translateX(0);
	}

	.mobile-nav-link {
		display: block;
		font-family: var(--font-heading);
		font-size: clamp(2rem, 8vw, 3.5rem);
		letter-spacing: -0.02em;
		color: var(--c-fg);
		padding: 0.6rem 0;
		line-height: 1.15;
		transition: color 0.15s ease, padding-left 0.15s ease;
	}

	.mobile-nav-link:hover {
		color: var(--c-fg-muted);
		padding-left: 0.5rem;
	}

	.mobile-nav-footer {
		padding-top: 2rem;
		border-top: 1px solid var(--c-border-site);
		margin-top: 2rem;
	}

	.mobile-lang-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		color: var(--c-fg-muted);
	}

	.mobile-lang-btn {
		background: none;
		border: none;
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		color: var(--c-fg-muted);
		cursor: pointer;
		padding: 0;
		transition: color 0.15s ease;
	}

	.mobile-lang-btn.active {
		color: var(--c-fg);
	}

	.mobile-lang-btn:hover {
		color: var(--c-fg);
	}

	/* Backdrop */
	.nav-backdrop {
		position: fixed;
		inset: 0;
		z-index: 98;
		background: rgba(0, 0, 0, 0.4);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.38s ease;
	}

	.nav-backdrop.visible {
		opacity: 1;
		pointer-events: auto;
	}

	@media (min-width: 768px) {
		.desktop-nav {
			display: flex;
		}

		.menu-btn {
			display: none;
		}

		.mobile-nav,
		.nav-backdrop {
			display: none;
		}
	}
</style>
