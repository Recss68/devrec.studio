import { postQuery } from '$lib/sanity/queries';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const { loadQuery } = locals.sanity;
	const post = await loadQuery(postQuery, { slug: params.slug });
	if (!post.data) throw error(404, 'Artikel niet gevonden.');
	return { query: postQuery, options: { initial: post }, params: { slug: params.slug } };
};
