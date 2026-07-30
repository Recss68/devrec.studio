import { portfolioAllQuery } from '$lib/sanity/queries';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { loadQuery } = locals.sanity;
	const projects = await loadQuery(portfolioAllQuery);
	return { query: portfolioAllQuery, options: { initial: projects } };
};
