<script>
	import { useQuery } from '@sanity/sveltekit';
	import { urlFor } from '$lib/sanity/image.js';
	import { PortableText } from '@portabletext/svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	const { data } = $props();
	const result = $derived(useQuery(data));
	const post = $derived($result.data);

	let locale = $state('nl');
	$effect(() => {
		try {
			locale = getLocale();
		} catch {
			locale = 'nl';
		}
	});

	const title = $derived(
		post
			? locale === 'en'
				? (post.title_en ?? post.title_nl)
				: (post.title_nl ?? post.title_en)
			: ''
	);
	const excerpt = $derived(
		post
			? locale === 'en'
				? (post.excerpt_en ?? post.excerpt_nl)
				: (post.excerpt_nl ?? post.excerpt_en)
			: ''
	);
	const body = $derived(
		post
			? locale === 'en'
				? (post.body_en ?? post.body_nl)
				: (post.body_nl ?? post.body_en)
			: null
	);

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
	{#if post}
		<title>{title} | devrec</title>
		<meta name="description" content={excerpt ?? ''} />
		<meta property="og:title" content="{title} | devrec" />
		<meta property="og:description" content={excerpt ?? ''} />
		{#if post.mainImage}
			<meta property="og:image" content={urlFor(post.mainImage).width(1200).height(630).url()} />
		{/if}
		<meta name="twitter:title" content="{title} | devrec" />
		<meta name="twitter:description" content={excerpt ?? ''} />
	{/if}
</svelte:head>

{#if post}
	<article class="post-page section">
		<div class="post-inner">
			<a href="/blog" class="back-link">
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
				{m.blog_back()}
			</a>

			<header class="post-header">
				<div class="post-meta">
					<time class="post-date" datetime={post.publishedAt}>
						{formatDate(post.publishedAt)}
					</time>
					{#if post.wordCount}
						<span class="post-reading-time">{readingTime(post.wordCount)}</span>
					{/if}
				</div>
				<h1 class="post-title">{title}</h1>
				{#if excerpt}
					<p class="post-excerpt">{excerpt}</p>
				{/if}
			</header>

			{#if post.mainImage}
				<div class="post-cover">
					<img
						src={urlFor(post.mainImage).width(1200).height(600).url()}
						alt={title}
						loading="eager"
					/>
				</div>
			{/if}

			{#if body}
				<div class="post-body">
					<PortableText value={body} />
				</div>
			{/if}
		</div>
	</article>
{/if}

<style>
	.post-page {
		padding-top: clamp(6rem, 12vw, 10rem);
		padding-bottom: clamp(4rem, 8vw, 6rem);
	}

	.post-inner {
		max-width: 740px;
		margin-inline: auto;
		padding-inline: clamp(1rem, 4vw, 2rem);
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

	.post-header {
		margin-bottom: clamp(2rem, 4vw, 3rem);
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.post-date {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--c-fg-muted);
	}

	.post-reading-time {
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--c-fg-muted);
		border: 1px solid var(--c-border-site);
		border-radius: 999px;
		padding: 0.15rem 0.6rem;
	}

	.post-title {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 6vw, 3.5rem);
		letter-spacing: -0.03em;
		line-height: 1.05;
		color: var(--c-fg);
		margin: 0 0 1rem;
	}

	.post-excerpt {
		font-size: clamp(1rem, 2vw, 1.15rem);
		color: var(--c-fg-muted);
		line-height: 1.65;
		margin: 0;
		border-left: 2px solid var(--c-border-site);
		padding-left: 1.25rem;
	}

	.post-cover {
		width: 100%;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		border-radius: 8px;
		border: 1px solid var(--c-border-site);
		margin-bottom: clamp(2rem, 4vw, 3rem);
	}

	.post-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.post-body {
		font-size: clamp(0.95rem, 1.8vw, 1.05rem);
		line-height: 1.8;
		color: var(--c-fg-muted);
	}

	.post-body :global(h2) {
		font-family: var(--font-heading);
		font-size: clamp(1.3rem, 3vw, 1.75rem);
		letter-spacing: -0.02em;
		color: var(--c-fg);
		margin: 2.5rem 0 0.75rem;
		line-height: 1.2;
	}

	.post-body :global(h3) {
		font-family: var(--font-heading);
		font-size: clamp(1.05rem, 2vw, 1.3rem);
		letter-spacing: -0.01em;
		color: var(--c-fg);
		margin: 2rem 0 0.6rem;
		line-height: 1.25;
	}

	.post-body :global(p) {
		margin: 0 0 1.4rem;
	}

	.post-body :global(p:last-child) {
		margin-bottom: 0;
	}

	.post-body :global(a) {
		color: var(--c-fg);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.post-body :global(a:hover) {
		color: var(--c-fg-muted);
	}

	.post-body :global(ul),
	.post-body :global(ol) {
		padding-left: 1.5rem;
		margin: 0 0 1.4rem;
	}

	.post-body :global(li) {
		margin-bottom: 0.4rem;
	}

	.post-body :global(blockquote) {
		border-left: 2px solid var(--c-border-site);
		padding-left: 1.25rem;
		margin: 1.5rem 0;
		color: var(--c-fg-muted);
		font-style: italic;
	}

	.post-body :global(code) {
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.85em;
		background: var(--c-bg-alt);
		border: 1px solid var(--c-border-site);
		border-radius: 4px;
		padding: 0.15em 0.4em;
	}

	.post-body :global(pre) {
		background: var(--c-bg-alt);
		border: 1px solid var(--c-border-site);
		border-radius: 8px;
		padding: 1.25rem;
		overflow-x: auto;
		margin: 0 0 1.4rem;
	}

	.post-body :global(pre code) {
		background: none;
		border: none;
		padding: 0;
		font-size: 0.875rem;
	}

	.post-body :global(img) {
		width: 100%;
		height: auto;
		border-radius: 6px;
		border: 1px solid var(--c-border-site);
		margin: 1rem 0;
	}

	.post-body :global(hr) {
		border: none;
		border-top: 1px solid var(--c-border-site);
		margin: 2.5rem 0;
	}
</style>
