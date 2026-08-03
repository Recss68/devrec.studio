<script>
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import {
		siReact, siTypescript, siJavascript, siHtml5, siCss, siFigma,
		siGit, siNodedotjs, siVuedotjs, siNextdotjs, siMysql, siPostgresql,
		siSvelte, siVite, siVercel, siExpress, siSanity, siWordpress, siPhp
	} from 'simple-icons';

	const iconMap = {
		'SvelteKit':              siSvelte.path,
		'Svelte 5':               siSvelte.path,
		'React':                  siReact.path,
		'React Native':           siReact.path,
		'Vue.js':                 siVuedotjs.path,
		'Next.js':                siNextdotjs.path,
		'TypeScript':             siTypescript.path,
		'JavaScript (ES2024)':    siJavascript.path,
		'HTML5':                  siHtml5.path,
		'CSS / SCSS':             siCss.path,
		'Vite':                   siVite.path,
		'Git & GitHub':           siGit.path,
		'Vercel / Netlify':       siVercel.path,
		'Node.js':                siNodedotjs.path,
		'Sanity CMS':             siSanity.path,
		'Express':                siExpress.path,
		'PostgreSQL':             siPostgresql.path,
		'MySQL':                  siMysql.path,
		'SvelteKit API Routes':   siSvelte.path,
		'Figma':                  siFigma.path,
		'WordPress':              siWordpress.path,
		'PHP':                    siPhp.path,
	};

	let locale = $state('nl');
	$effect(() => {
		try {
			locale = getLocale();
		} catch {
			locale = 'nl';
		}
	});

	const t = (obj) => {
		if (typeof obj === 'string') return obj;
		return locale === 'en' && obj.en ? obj.en : obj.nl;
	};

	const experience = [
		{
			role: { nl: 'Stagiair Full Stack Development', en: 'Full Stack Development Intern' },
			company: 'Level.works',
			period: { nl: 'feb 2026 – jul 2026', en: 'Feb 2026 – Jul 2026' },
			desc: {
				nl: 'Afstudeerstage full stack development. Bijdragen aan de ontwikkeling van interne platformen en tools.',
				en: 'Final internship in full stack development. Contributing to the development of internal platforms and tools.'
			},
			tags: ['React', 'React Native', 'TypeScript', 'Unit Testing', 'Scrum', 'AWS', 'Lambda', 'Git']
		},
		{
			role: { nl: 'Vrijwilliger Mentor Front-end Development', en: 'Volunteer Mentor Front-end Development' },
			company: 'FDND – Hogeschool van Amsterdam',
			period: { nl: 'sep 2025 – jan 2026', en: 'Sep 2025 – Jan 2026' },
			desc: {
				nl: "Studenten van de opleiding Front-end Design & Development begeleid als mentor. Feedback gegeven op projecten en geholpen bij het begrijpen van HTML, CSS en JavaScript.",
				en: 'Mentored students of the Front-end Design & Development programme. Gave feedback on projects and helped students understand HTML, CSS and JavaScript.'
			},
			tags: ['HTML', 'CSS', 'JavaScript', 'Mentoring']
		},
		{
			role: { nl: 'Freelance Web Developer', en: 'Freelance Web Developer' },
			company: 'Creaway',
			period: { nl: 'jan 2025 – heden', en: 'Jan 2025 – present' },
			desc: {
				nl: 'Freelance webdevelopment voor klanten van Creaway. Bouwen van op maat gemaakte websites met focus op design, performance en gebruikerservaring.',
				en: 'Freelance web development for Creaway clients. Building custom websites with a focus on design, performance and user experience.'
			},
			tags: ['SvelteKit', 'WordPress', 'Figma', 'CSS']
		},
		{
			role: { nl: 'Stagiair Full Stack Development', en: 'Full Stack Development Intern' },
			company: 'Mexelina Uitzendgroep',
			period: { nl: 'jan 2024 – jul 2024', en: 'Jan 2024 – Jul 2024' },
			desc: {
				nl: 'Stage full stack development. Bijgedragen aan interne webapplicaties en het verbeteren van bestaande systemen binnen het uitzendbureau.',
				en: 'Full stack development internship. Contributed to internal web applications and improving existing systems within the staffing agency.'
			},
			tags: ['HTML', 'CSS', 'JavaScript', 'PHP']
		},
		{
			role: { nl: 'Webdeveloper & Founder', en: 'Web Developer & Founder' },
			company: 'DevRec',
			period: { nl: 'mei 2023 – heden', en: 'May 2023 – present' },
			desc: {
				nl: "Oprichter van DevRec. Ik bouw snelle, toegankelijke websites voor zzp'ers en mkb'ers. Van ontwerp tot live site — focus op SvelteKit, performance en moderne webstandaarden.",
				en: "Founder of DevRec. Building fast, accessible websites for freelancers and SMBs. From design to live site — focus on SvelteKit, performance and modern web standards."
			},
			tags: ['SvelteKit', 'Svelte 5', 'TypeScript', 'Sanity CMS', 'Vercel']
		},
		{
			role: { nl: 'Stagiair Full Stack Development', en: 'Full Stack Development Intern' },
			company: 'Nationaal Theoriecentrum BV',
			period: { nl: 'feb 2023 – jun 2023', en: 'Feb 2023 – Jun 2023' },
			desc: {
				nl: 'Eerste stage full stack development. Assistentie bij het bouwen en onderhouden van webapplicaties voor rijscholen en theorie-examens.',
				en: 'First full stack development internship. Assisted in building and maintaining web applications for driving schools and theory exams.'
			},
			tags: ['HTML', 'CSS', 'JavaScript', 'PHP']
		}
	];

	const education = [
		{
			degree: { nl: 'Software Development', en: 'Software Development' },
			school: 'MBO College Amstelland',
			period: '2021 – 2024',
			level: { nl: 'MBO Niveau 4', en: 'MBO Level 4' },
			note: { nl: 'Diploma behaald', en: 'Diploma obtained' }
		},
		{
			degree: { nl: 'Front End Design & Development', en: 'Front End Design & Development' },
			school: 'Hogeschool van Amsterdam (HvA)',
			period: '2024 – 2026',
			level: { nl: 'Associate Degree (AD)', en: 'Associate Degree (AD)' },
			note: { nl: 'Diploma behaald', en: 'Diploma obtained' }
		}
	];

	const certifications = [
		{ name: 'Meta Front-End Developer Certificate', issuer: 'Meta (via Coursera)', year: '2024' },
		{ name: 'Google UX Design Certificate', issuer: 'Google (via Coursera)', year: '2024' },
		{ name: 'Web Accessibility Fundamentals', issuer: 'W3C / edX', year: '2023' },
		{ name: 'JavaScript Algorithms & Data Structures', issuer: 'freeCodeCamp', year: '2023' }
	];

	const skillGroups = [
		{
			label: 'Front-end',
			skills: ['SvelteKit', 'Svelte 5', 'React', 'React Native', 'Vue.js', 'Next.js', 'TypeScript', 'JavaScript (ES2024)', 'HTML5', 'CSS / SCSS']
		},
		{
			label: 'Tooling & Deployment',
			skills: ['Vite', 'Git & GitHub', 'Vercel / Netlify', 'Node.js', 'Vitest']
		},
		{
			label: 'CMS & Backend',
			skills: ['Sanity CMS', 'Express', 'Liquid', 'REST APIs', 'SvelteKit API Routes', 'PostgreSQL', 'MySQL']
		},
		{
			label: 'Design & UX',
			skills: ['Figma', 'Responsive Design', 'Accessibility (WCAG 2.2)', 'Web Performance']
		}
	];

	const languages = [
		{ nl: 'Nederlands (vloeiend)', en: 'Dutch (fluent)' },
		{ nl: 'Engels (vloeiend)', en: 'English (fluent)' },
		{ nl: 'Turks (vloeiend)', en: 'Turkish (fluent)' }
	];
</script>

<svelte:head>
	<title>{m.cv_page_title()}</title>
	<meta name="description" content={m.cv_page_meta()} />
	<meta property="og:title" content={m.cv_page_title()} />
	<meta property="og:description" content={m.cv_page_meta()} />
</svelte:head>

<!-- ── Hero ─────────────────────────────────────────────────────────────────── -->
<section class="cv-hero">
	<div class="cv-hero-gradient" aria-hidden="true"></div>

	<div class="cv-hero-inner">
		<div class="cv-hero-top">
			<a href="/" class="back-link">
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<line x1="19" y1="12" x2="5" y2="12" />
					<polyline points="12 19 5 12 12 5" />
				</svg>
				{m.cv_back()}
			</a>
		</div>

		<div class="cv-hero-content">
			<span class="availability-badge">
				<span class="availability-dot" aria-hidden="true"></span>
				{m.cv_hero_label()}
			</span>

			<h1 class="cv-name">{m.cv_hero_name()}</h1>
			<p class="cv-title">{m.cv_hero_title()}</p>
			<p class="cv-tagline">{m.cv_hero_tagline()}</p>

			<div class="cv-actions">
				<a href="/#contact" class="btn btn-primary">{m.cv_hero_cta()}</a>
				<!-- CV download — herinschakelen zodra beveiliging is ingesteld
				<a href="/cv.pdf" class="btn btn-secondary" download>
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						aria-hidden="true"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="7 10 12 15 17 10" />
						<line x1="12" y1="15" x2="12" y2="3" />
					</svg>
					{m.cv_hero_download()}
				</a>
				-->
			</div>
		</div>

		<span class="cv-hero-bg-name" aria-hidden="true">{m.cv_hero_name()}</span>
	</div>
</section>

<!-- ── Experience ───────────────────────────────────────────────────────────── -->
<section class="cv-section" id="ervaring">
	<div class="cv-section-inner">
		<header class="section-head">
			<span class="section-label">{m.cv_exp_label()}</span>
			<h2 class="section-heading">{m.cv_exp_heading()}</h2>
		</header>

		<ol class="timeline" aria-label={m.cv_exp_label()}>
			{#each experience as item, i}
				<li class="exp-item">
					<div class="exp-dot" aria-hidden="true"></div>

					<div class="exp-body">
						<div class="exp-top">
							<div class="exp-meta">
								<span class="exp-company">{item.company}</span>
								<span class="exp-sep" aria-hidden="true">·</span>
								<time class="exp-period">{t(item.period)}</time>
							</div>
							<h3 class="exp-role">{t(item.role)}</h3>
						</div>

						<p class="exp-desc">{t(item.desc)}</p>

						<div class="exp-tags" aria-label="Technologieën">
							{#each item.tags as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- ── Skills ───────────────────────────────────────────────────────────────── -->
<section class="cv-section cv-section-alt" id="vaardigheden">
	<div class="cv-section-inner">
		<header class="section-head">
			<span class="section-label">{m.cv_skills_label()}</span>
			<h2 class="section-heading">{m.cv_skills_heading()}</h2>
		</header>

		<div class="skills-grid">
			{#each skillGroups as group}
				<div class="skill-group">
					<span class="skill-group-label">{group.label}</span>
					<div class="skill-tags">
						{#each group.skills as skill}
							<span class="skill-tag">
								{#if iconMap[skill]}
									<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0">
										<path d={iconMap[skill]} />
									</svg>
								{/if}
								{skill}
							</span>
						{/each}
					</div>
				</div>
			{/each}

			<div class="skill-group">
				<span class="skill-group-label">{locale === 'en' ? 'Languages' : 'Talen'}</span>
				<div class="skill-tags">
					{#each languages as lang}
						<span class="skill-tag">{t(lang)}</span>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ── Education ────────────────────────────────────────────────────────────── -->
<section class="cv-section" id="opleiding">
	<div class="cv-section-inner">
		<header class="section-head">
			<span class="section-label">{m.cv_edu_label()}</span>
			<h2 class="section-heading">{m.cv_edu_heading()}</h2>
		</header>

		<div class="edu-grid">
			{#each education as item}
				<article class="edu-card">
					<div class="edu-card-top">
						<span class="edu-level">{t(item.level)}</span>
						<span class="edu-period">{t(item.period)}</span>
					</div>
					<h3 class="edu-degree">{t(item.degree)}</h3>
					<p class="edu-school">{item.school}</p>
					{#if item.note}
						<span class="edu-note">
							<svg
								width="11"
								height="11"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								aria-hidden="true"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
							{t(item.note)}
						</span>
					{/if}
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ── Certifications — uitgecommentarieerd, content volgt later ─────────────
<section class="cv-section cv-section-alt" id="certificaten">
	<div class="cv-section-inner">
		<header class="section-head">
			<span class="section-label">{m.cv_cert_label()}</span>
			<h2 class="section-heading">{m.cv_cert_heading()}</h2>
		</header>

		<ol class="cert-list" aria-label={m.cv_cert_label()}>
			{#each certifications as cert, i}
				<li class="cert-item">
					<div class="cert-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
					<div class="cert-info">
						<span class="cert-name">{cert.name}</span>
						<span class="cert-issuer">{cert.issuer}</span>
					</div>
					<span class="cert-year">{cert.year}</span>
				</li>
			{/each}
		</ol>
	</div>
</section>
──────────────────────────────────────────────────────────────────────────── -->

<!-- ── CTA ──────────────────────────────────────────────────────────────────── -->
<section class="cv-cta">
	<div class="cv-cta-gradient" aria-hidden="true"></div>
	<div class="cv-cta-inner">
		<span class="cta-label">{m.cv_cert_label() && locale === 'en' ? 'Available' : 'Beschikbaar'}</span>
		<h2 class="cta-heading">{m.cv_cta_heading()}</h2>
		<p class="cta-sub">{m.cv_cta_sub()}</p>
		<a href="/#contact" class="btn btn-cta">{m.cv_cta_btn()}</a>
	</div>
</section>

<style>
	/* ── Hero ──────────────────────────────────────────────────────────────────── */
	.cv-hero {
		position: relative;
		min-height: 100svh;
		overflow: hidden;
		background: var(--hero-bg);
		display: flex;
		flex-direction: column;
		transition: background 0.2s ease;
	}

	.cv-hero-gradient {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--hero-gradient-opacity);
		transition: opacity 0.2s ease;
		background:
			radial-gradient(ellipse 90% 65% at -5% 105%, hsla(272, 80%, 52%, 0.6) 0%, transparent 55%),
			radial-gradient(ellipse 80% 60% at 105% 95%, hsla(260, 78%, 48%, 0.55) 0%, transparent 55%);
	}

	.cv-hero-inner {
		position: relative;
		z-index: 1;
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-inline: clamp(1.25rem, 5vw, 2.5rem);
		max-width: 1280px;
		margin-inline: auto;
		width: 100%;
	}

	.cv-hero-top {
		padding-top: clamp(5.5rem, 8vw, 7rem);
		padding-bottom: 1.5rem;
	}

	.cv-hero-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding-bottom: 5rem;
		max-width: 820px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: var(--hero-text-muted);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.back-link:hover {
		color: var(--hero-text);
	}

	.availability-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--hero-text-muted);
		border: 1px solid var(--hero-border);
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
		margin-bottom: 2rem;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.availability-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #22c55e;
		flex-shrink: 0;
		animation: pulse-dot 2s ease-in-out infinite;
	}

	@keyframes pulse-dot {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.6;
			transform: scale(0.85);
		}
	}

	.cv-name {
		font-family: var(--font-heading);
		font-size: clamp(4.5rem, 14vw, 11rem);
		line-height: 0.95;
		letter-spacing: -0.04em;
		color: var(--hero-text);
		margin: 0 0 0.5rem 0;
		transition: color 0.2s ease;
	}

	.cv-title {
		font-family: var(--font-heading);
		font-size: clamp(1rem, 2.5vw, 1.5rem);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--hero-text-muted);
		margin: 0 0 1.5rem 0;
		line-height: 1;
		transition: color 0.2s ease;
	}

	.cv-tagline {
		font-size: clamp(0.95rem, 2vw, 1.1rem);
		color: var(--hero-text-muted);
		max-width: 460px;
		line-height: 1.65;
		margin: 0 0 2.5rem 0;
		transition: color 0.2s ease;
	}

	.cv-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.75rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		font-family: var(--font-body);
		letter-spacing: 0.01em;
		border-radius: 6px;
		transition:
			opacity 0.15s ease,
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease;
		white-space: nowrap;
		cursor: pointer;
		text-decoration: none;
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

	.cv-hero-bg-name {
		position: absolute;
		bottom: -0.1em;
		right: -0.05em;
		font-family: var(--font-heading);
		font-size: clamp(8rem, 22vw, 18rem);
		line-height: 1;
		letter-spacing: -0.05em;
		color: var(--hero-text);
		opacity: 0.035;
		pointer-events: none;
		user-select: none;
		white-space: nowrap;
		transition: color 0.2s ease;
	}

	/* ── Shared section styles ─────────────────────────────────────────────────── */
	.cv-section {
		padding-block: clamp(4.5rem, 8vw, 6rem);
		background: var(--c-bg);
		transition: background 0.2s ease;
	}

	.cv-section-alt {
		background: var(--c-bg-alt);
	}

	.cv-section-inner {
		max-width: 1120px;
		margin-inline: auto;
		padding-inline: clamp(1.25rem, 5vw, 2.5rem);
	}

	.section-head {
		margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
	}

	.section-label {
		display: block;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		margin-bottom: 0.75rem;
		transition: color 0.2s ease;
	}

	.section-heading {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5vw, 3.25rem);
		letter-spacing: -0.025em;
		line-height: 1.05;
		color: var(--c-fg);
		margin: 0;
		transition: color 0.2s ease;
	}

	/* ── Timeline ──────────────────────────────────────────────────────────────── */
	.timeline {
		list-style: none;
		padding: 0;
		margin: 0;
		position: relative;
		padding-left: 1.5rem;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.45rem;
		bottom: 1rem;
		width: 1px;
		background: var(--c-border-site);
		transition: background 0.2s ease;
	}

	.exp-item {
		position: relative;
		padding-bottom: 3rem;
	}

	.exp-item:last-child {
		padding-bottom: 0;
	}

	.exp-dot {
		position: absolute;
		left: -1.5rem;
		top: 0.42rem;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--c-fg);
		transform: translateX(-4px);
		border: 2px solid var(--c-bg);
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			transform 0.2s ease;
	}

	.exp-item:hover .exp-dot {
		transform: translateX(-4px) scale(1.35);
	}

	.exp-body {
		padding-left: 1rem;
	}

	.exp-top {
		margin-bottom: 0.75rem;
	}

	.exp-meta {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 0.3rem;
	}

	.exp-company {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		transition: color 0.2s ease;
	}

	.exp-sep {
		color: var(--c-border-site);
		font-size: 0.8rem;
	}

	.exp-period {
		font-size: 0.8rem;
		color: var(--c-fg-muted);
		transition: color 0.2s ease;
	}

	.exp-role {
		font-family: var(--font-heading);
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		letter-spacing: -0.015em;
		line-height: 1.15;
		color: var(--c-fg);
		margin: 0;
		transition: color 0.2s ease;
	}

	.exp-desc {
		font-size: 0.9rem;
		color: var(--c-fg-muted);
		line-height: 1.7;
		margin: 0 0 1.1rem 0;
		max-width: 640px;
		transition: color 0.2s ease;
	}

	.exp-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.tag {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		border: 1px solid var(--c-border-site);
		padding: 0.2rem 0.55rem;
		border-radius: 4px;
		transition:
			color 0.15s ease,
			border-color 0.15s ease;
	}

	/* ── Skills ────────────────────────────────────────────────────────────────── */
	.skills-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.skill-group {
		padding: 1.5rem;
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		background: var(--c-bg);
		transition:
			background 0.2s ease,
			border-color 0.2s ease;
	}

	.skill-group-label {
		display: block;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		margin-bottom: 1rem;
		transition: color 0.2s ease;
	}

	.skill-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.skill-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--c-fg);
		background: var(--c-bg-alt);
		border: 1px solid var(--c-border-site);
		padding: 0.3rem 0.7rem;
		border-radius: 5px;
		transition:
			background 0.15s ease,
			color 0.15s ease,
			border-color 0.15s ease,
			transform 0.15s ease;
		cursor: default;
	}

	.skill-tag:hover {
		background: var(--c-fg);
		color: var(--c-bg);
		border-color: var(--c-fg);
		transform: translateY(-1px);
	}

	/* ── Education ─────────────────────────────────────────────────────────────── */
	.edu-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}

	.edu-card {
		padding: 1.75rem;
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		background: var(--c-bg);
		transition:
			background 0.15s ease,
			border-color 0.15s ease;
	}

	.edu-card:hover {
		background: var(--c-bg-alt);
	}

	.edu-card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.9rem;
	}

	.edu-level {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		transition: color 0.2s ease;
	}

	.edu-period {
		font-size: 0.75rem;
		color: var(--c-fg-muted);
		transition: color 0.2s ease;
	}

	.edu-degree {
		font-family: var(--font-heading);
		font-size: clamp(1.1rem, 2.5vw, 1.4rem);
		letter-spacing: -0.01em;
		color: var(--c-fg);
		margin: 0 0 0.35rem 0;
		line-height: 1.2;
		transition: color 0.2s ease;
	}

	.edu-school {
		font-size: 0.875rem;
		color: var(--c-fg-muted);
		margin: 0 0 0.75rem 0;
		transition: color 0.2s ease;
	}

	.edu-note {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: #16a34a;
		letter-spacing: 0.02em;
	}

	:global([data-theme='dark']) .edu-note {
		color: #4ade80;
	}

	/* ── Certifications ────────────────────────────────────────────────────────── */
	.cert-list {
		list-style: none;
		padding: 0;
		margin: 0;
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		overflow: hidden;
		transition: border-color 0.2s ease;
	}

	.cert-item {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--c-border-site);
		background: var(--c-bg);
		transition:
			background 0.15s ease,
			border-color 0.2s ease;
	}

	.cert-item:last-child {
		border-bottom: none;
	}

	.cert-item:hover {
		background: var(--c-bg-alt);
	}

	.cert-number {
		font-family: var(--font-heading);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--c-fg-muted);
		min-width: 1.75rem;
		transition: color 0.2s ease;
	}

	.cert-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.cert-name {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--c-fg);
		line-height: 1.3;
		transition: color 0.2s ease;
	}

	.cert-issuer {
		font-size: 0.78rem;
		color: var(--c-fg-muted);
		transition: color 0.2s ease;
	}

	.cert-year {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--c-fg-muted);
		white-space: nowrap;
		transition: color 0.2s ease;
	}

	/* ── CTA ───────────────────────────────────────────────────────────────────── */
	.cv-cta {
		position: relative;
		overflow: hidden;
		background: var(--hero-bg);
		padding-block: clamp(5rem, 10vw, 8rem);
		transition: background 0.2s ease;
	}

	.cv-cta-gradient {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--hero-gradient-opacity);
		transition: opacity 0.2s ease;
		background:
			radial-gradient(ellipse 80% 70% at 10% 90%, hsla(272, 80%, 52%, 0.5) 0%, transparent 55%),
			radial-gradient(ellipse 70% 60% at 90% 85%, hsla(260, 78%, 48%, 0.45) 0%, transparent 55%);
	}

	.cv-cta-inner {
		position: relative;
		z-index: 1;
		max-width: 1120px;
		margin-inline: auto;
		padding-inline: clamp(1.25rem, 5vw, 2.5rem);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.cta-label {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--hero-text-muted);
		margin-bottom: 1.25rem;
		transition: color 0.2s ease;
	}

	.cta-heading {
		font-family: var(--font-heading);
		font-size: clamp(2.25rem, 6vw, 4.5rem);
		letter-spacing: -0.03em;
		line-height: 1.05;
		color: var(--hero-text);
		margin: 0 0 1rem 0;
		max-width: 680px;
		transition: color 0.2s ease;
	}

	.cta-sub {
		font-size: clamp(0.9rem, 2vw, 1rem);
		color: var(--hero-text-muted);
		max-width: 480px;
		line-height: 1.65;
		margin: 0 0 2.5rem 0;
		transition: color 0.2s ease;
	}

	.btn-cta {
		background: var(--hero-btn-primary-bg);
		color: var(--hero-btn-primary-text);
		border: 1px solid var(--hero-btn-primary-bg);
		padding: 0.85rem 1.75rem;
		font-size: 0.9rem;
	}

	.btn-cta:hover {
		opacity: 0.85;
	}

	/* ── Responsive ────────────────────────────────────────────────────────────── */
	@media (min-width: 640px) {
		.edu-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 768px) {
		.skills-grid {
			grid-template-columns: 1fr 1fr;
		}

		.timeline {
			padding-left: 2rem;
		}

		.exp-dot {
			left: -2rem;
			transform: translateX(-4px);
		}

		.exp-item:hover .exp-dot {
			transform: translateX(-4px) scale(1.35);
		}
	}
</style>
