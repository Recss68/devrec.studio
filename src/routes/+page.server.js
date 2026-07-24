import { reviewsQuery, portfolioPreviewQuery } from '$lib/sanity/queries';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { loadQuery } = locals.sanity;
	const [reviews, projects] = await Promise.all([
		loadQuery(reviewsQuery),
		loadQuery(portfolioPreviewQuery)
	]);
	return {
		reviews: { query: reviewsQuery, options: { initial: reviews } },
		projects: { query: portfolioPreviewQuery, options: { initial: projects } }
	};
};
