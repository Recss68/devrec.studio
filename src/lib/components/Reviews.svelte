<script>
	import { m } from '$lib/paraglide/messages.js';
	import ReviewModal from './ReviewModal.svelte';

	/** @type {{ reviews: Array<{_id: string, author_name: string, rating: number, date: string, text: string}> }} */
	const { reviews = [] } = $props();

	let reviewModalOpen = $state(false);

	const avgRating = $derived(
		reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
	);

	function starList(rating) {
		const r = Math.round(rating ?? 0);
		return Array.from({ length: 5 }, (_, i) => i < r);
	}

	function initials(name = '') {
		return name
			.split(' ')
			.map((p) => p[0] ?? '')
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}

	function timeAgo(dateStr = '') {
		const diff = Date.now() - new Date(dateStr).getTime();
		const days = Math.floor(diff / 86400000);
		if (days < 1) return 'vandaag';
		if (days < 2) return 'gisteren';
		if (days < 14) return `${days} dagen geleden`;
		const months = Math.floor(days / 30.5);
		if (months < 2) return 'een maand geleden';
		if (months < 12) return `${months} maanden geleden`;
		const years = Math.floor(months / 12);
		return years < 2 ? 'een jaar geleden' : `${years} jaar geleden`;
	}

	function excerpt(text = '', max = 200) {
		if (text.length <= max) return text;
		return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
	}
</script>

{#if reviews.length > 0}
	<section class="section reviews-section" id="beoordelingen">
		<div class="section-inner">
			<div class="reviews-head">
				<span class="section-label">{m.reviews_label()}</span>
				<div class="reviews-top-row">
					<h2 class="reviews-h2">{m.reviews_heading()}</h2>
					<div class="reviews-actions">
						<button class="write-review-btn" onclick={() => (reviewModalOpen = true)}>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
							</svg>
							Schrijf een review
						</button>
						<a
							class="reviews-google-link"
							href="https://share.google/7fgzycj46jYqC11XC"
							target="_blank"
							rel="noopener noreferrer"
							aria-label={m.reviews_all_link()}
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							<span>{m.reviews_all_link()}</span>
						</a>
					</div>
				</div>

				{#if avgRating > 0}
					<div class="rating-summary">
						<span class="rating-num">{avgRating.toFixed(1)}</span>
						<div class="rating-stars" aria-label="{avgRating.toFixed(1)} / 5">
							{#each starList(avgRating) as filled}
								<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
									{#if filled}
										<polygon
											fill="currentColor"
											points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
										/>
									{:else}
										<polygon
											fill="none"
											stroke="currentColor"
											stroke-width="1.5"
											points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
										/>
									{/if}
								</svg>
							{/each}
						</div>
						<span class="rating-count">{m.reviews_rating_count({ total: reviews.length })}</span>
					</div>
				{/if}
			</div>

			<div class="reviews-track">
				{#each reviews as review (review._id)}
					<article class="review-card">
						<div class="review-header">
							<div class="review-avatar" aria-hidden="true">{initials(review.author_name)}</div>
							<div class="review-meta">
								<span class="review-name">{review.author_name}</span>
								<span class="review-time">{timeAgo(review.date)}</span>
							</div>
							<div class="review-stars" aria-label="{review.rating} van 5 sterren">
								{#each starList(review.rating) as filled}
									<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
										{#if filled}
											<polygon
												fill="currentColor"
												points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
											/>
										{:else}
											<polygon
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
											/>
										{/if}
									</svg>
								{/each}
							</div>
						</div>
						<p class="review-text">{excerpt(review.text)}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<ReviewModal open={reviewModalOpen} onclose={() => (reviewModalOpen = false)} />
{/if}

<style>
	.reviews-section {
		overflow: hidden;
		max-width: 100%;
	}

	.reviews-head {
		margin-bottom: clamp(2rem, 4vw, 3rem);
	}

	.reviews-top-row {
		display: flex;
		align-items: baseline;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin: 0.5rem 0 0.75rem;
	}

	.reviews-h2 {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5vw, 3.5rem);
		letter-spacing: -0.03em;
		line-height: 1.05;
		color: var(--c-fg);
		margin: 0;
	}

	.reviews-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.write-review-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--c-fg);
		background: none;
		border: 1px solid var(--c-border-site);
		border-radius: 6px;
		padding: 0.35rem 0.75rem;
		cursor: pointer;
		transition:
			border-color 0.15s,
			background 0.15s;
		font-family: inherit;
		white-space: nowrap;
	}

	.write-review-btn:hover {
		border-color: var(--c-fg);
		background: var(--c-bg-alt);
	}

	.reviews-google-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--c-fg-muted);
		text-decoration: none;
		white-space: nowrap;
		transition: color 0.15s;
	}

	.reviews-google-link:hover {
		color: var(--c-fg);
	}

	.rating-summary {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.rating-num {
		font-family: var(--font-heading);
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.04em;
		color: var(--c-fg);
		line-height: 1;
	}

	.rating-stars {
		display: flex;
		gap: 2px;
		color: var(--c-fg);
	}

	.rating-count {
		font-size: 0.82rem;
		color: var(--c-fg-muted);
	}

	/* Horizontal scroll track */
	.reviews-track {
		display: flex;
		gap: 1.25rem;
		overflow-x: auto;
		padding-bottom: 1rem;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		/* hide scrollbar but keep functionality */
		scrollbar-width: none;
	}

	.reviews-track::-webkit-scrollbar {
		display: none;
	}

	/* Cards */
	.review-card {
		flex: 0 0 clamp(260px, 34vw, 360px);
		scroll-snap-align: start;
		border: 1px solid var(--c-border-site);
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		background: var(--c-bg);
		transition: border-color 0.2s;
	}

	.review-card:hover {
		border-color: var(--c-fg);
	}

	.review-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.review-avatar {
		flex-shrink: 0;
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: var(--c-fg);
		color: var(--c-bg);
		font-size: 0.75rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		letter-spacing: 0.02em;
	}

	.review-meta {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
	}

	.review-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--c-fg);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.review-time {
		font-size: 0.75rem;
		color: var(--c-fg-muted);
	}

	.review-stars {
		display: flex;
		gap: 1px;
		color: var(--c-fg);
		flex-shrink: 0;
	}

	.review-text {
		font-size: 0.875rem;
		color: var(--c-fg-muted);
		line-height: 1.65;
		margin: 0;
	}
</style>
