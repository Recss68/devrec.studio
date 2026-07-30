<script>
	import { useQuery } from '@sanity/sveltekit';
	import { urlFor } from '$lib/sanity/image.js';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	const { data } = $props();
	const result = $derived(useQuery(data));
	const posts = $derived($result.data ?? []);

	let locale = $state('nl');
	$effect(() => {
		try {
			locale = getLocale();
		} catch {
			locale = 'nl';
		}
	});

	function formatDate(dateStr = '') {
		if (!dateStr) return '';
		return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'nl-NL', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(dateStr));
	}

	function readingTime(wordCount = 0) {
		const minutes = Math.max(1, Math.ceil(wordCount / 200));
		return m.blog_min_read({ minutes });
	}
</script>

<svelte:head>
	<title>{m.blog_page_title()}</title>
	<meta name="description" content={m.blog_meta_desc()} />
	<meta property="og:title" content={m.blog_page_title()} />
	<meta property="og:description" content={m.blog_meta_desc()} />
	<meta name="twitter:title" content={m.blog_page_title()} />
	<meta name="twitter:description" content={m.blog_meta_desc()} />
</svelte:head>

<div class="blog-page section">
	<div class="section-inner">
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
			{m.portfolio_back()}
		</a>

		<div class="page-head">
			<span class="section-label">{m.nav_blog()}</span>
			<h1 class="page-h1">{m.blog_heading()}</h1>
			<p class="page-sub">{m.blog_sub()}</p>
		</div>

		{#if posts.length === 0}
			<div class="empty-state">
				<p>{m.blog_empty()}</p>
			</div>
		{:else}
			<div class="posts-grid">
				{#each posts as post (post._id)}
					{@const title =
						locale === 'en' ? (post.title_en ?? post.title_nl) : (post.title_nl ?? post.title_en)}
					{@const excerpt =
						locale === 'en'
							? (post.excerpt_en ?? post.excerpt_nl)
							: (post.excerpt_nl ?? post.excerpt_en)}
					<a href="/blog/{post.slug.current}" class="post-card">
						<div class="card-image">
							{#if post.mainImage}
								<img
									src={urlFor(post.mainImage).width(800).height(450).url()}
									alt={title}
									loading="lazy"
								/>
							{:else}
								<div class="card-placeholder" aria-hidden="true">
									<span class="placeholder-label">{title}</span>
								</div>
							{/if}
						</div>
						<div class="card-body">
							<div class="card-meta">
								<time class="card-date" datetime={post.publishedAt}>
									{formatDate(post.publishedAt)}
								</time>
								{#if post.wordCount}
									<span class="card-reading-time">{readingTime(post.wordCount)}</span>
								{/if}
							</div>
							<h2 class="card-title">{title}</h2>
							{#if excerpt}
								<p class="card-excerpt">{excerpt}</p>
							{/if}
							<span class="card-read">{m.blog_read_more()}</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.blog-page {
		padding-top: clamp(6rem, 12vw, 10rem);
		padding-bottom: clamp(4rem, 8vw, 6rem);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: var(--c-fg-muted);
		text-decoration: none;
		margin-bottom: 3rem;
		transition: color 0.15s;
	}

	.back-link:hover {
		color: var(--c-fg);
	}

	.page-head {
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}

	.page-h1 {
		font-family: var(--font-heading);
		font-size: clamp(2.5rem, 7vw, 5rem);
		letter-spacing: -0.03em;
		line-height: 1.05;
		color: var(--c-fg);
		margin: 0.5rem 0 0.75rem;
	}

	.page-sub {
		font-size: clamp(0.95rem, 2vw, 1.05rem);
		color: var(--c-fg-muted);
		line-height: 1.65;
		margin: 0;
		max-width: 480px;
	}

	.empty-state {
		padding: 4rem 0;
		color: var(--c-fg-muted);
		font-size: 0.95rem;
	}

	.posts-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		overflow: hidden;
	}

	.post-card {
		display: flex;
		flex-direction: column;
		background: var(--c-bg);
		border-bottom: 1px solid var(--c-border-site);
		text-decoration: none;
		transition: background 0.15s;
	}

	.post-card:last-child {
		border-bottom: none;
	}

	.post-card:hover {
		background: var(--c-bg-alt);
	}

	.card-image {
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-bottom: 1px solid var(--c-border-site);
		flex-shrink: 0;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.4s ease;
	}

	.post-card:hover .card-image img {
		transform: scale(1.03);
	}

	.card-placeholder {
		width: 100%;
		height: 100%;
		background: var(--c-bg-alt);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	.card-placeholder::before {
		content: '';
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			-45deg,
			transparent,
			transparent 12px,
			var(--c-border-site) 12px,
			var(--c-border-site) 13px
		);
		opacity: 0.4;
	}

	.placeholder-label {
		font-family: var(--font-heading);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
		position: relative;
		z-index: 1;
		background: var(--c-bg);
		padding: 0.35rem 0.75rem;
		border: 1px solid var(--c-border-site);
		border-radius: 4px;
	}

	.card-body {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	.card-meta {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.card-date {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
	}

	.card-reading-time {
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--c-fg-muted);
		border: 1px solid var(--c-border-site);
		border-radius: 999px;
		padding: 0.15rem 0.55rem;
		white-space: nowrap;
	}

	.card-title {
		font-family: var(--font-heading);
		font-size: clamp(1.1rem, 2.5vw, 1.5rem);
		letter-spacing: -0.02em;
		line-height: 1.2;
		color: var(--c-fg);
		margin: 0;
	}

	.card-excerpt {
		font-size: 0.875rem;
		color: var(--c-fg-muted);
		line-height: 1.65;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-read {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--c-fg-muted);
		margin-top: auto;
		padding-top: 0.75rem;
		transition: color 0.15s;
	}

	.post-card:hover .card-read {
		color: var(--c-fg);
	}

	@media (min-width: 640px) {
		.posts-grid {
			grid-template-columns: 1fr 1fr;
		}

		.post-card {
			border-right: 1px solid var(--c-border-site);
		}

		.post-card:nth-child(2n) {
			border-right: none;
		}

		.post-card:nth-last-child(-n + 2) {
			border-bottom: none;
		}

		.post-card:last-child {
			border-bottom: none;
		}
	}

	@media (min-width: 1024px) {
		.posts-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.post-card {
			border-right: 1px solid var(--c-border-site);
			border-bottom: 1px solid var(--c-border-site);
		}

		.post-card:nth-child(2n) {
			border-right: 1px solid var(--c-border-site);
		}

		.post-card:nth-child(3n) {
			border-right: none;
		}

		.post-card:nth-last-child(-n + 3) {
			border-bottom: none;
		}

		.post-card:not(:nth-last-child(-n + 3)) {
			border-bottom: 1px solid var(--c-border-site);
		}
	}
</style>
