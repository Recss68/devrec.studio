import { postsQuery } from '$lib/sanity/queries';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { loadQuery } = locals.sanity;
	const posts = await loadQuery(postsQuery);
	return { query: postsQuery, options: { initial: posts } };
};
