/** @type {import('./$types').LayoutServerLoad} */
export const load = (event) => {
	const { previewEnabled } = event.locals.sanity;
	return { previewEnabled };
};
