import { serverClient } from '$lib/sanity/client.server.js';

const SITE = 'https://devrec.nl';

const staticPages = [
	{ path: '/',                      priority: '1.0', changefreq: 'weekly'  },
	{ path: '/over-mij',              priority: '0.9', changefreq: 'monthly' },
	{ path: '/portfolio',             priority: '0.8', changefreq: 'monthly' },
	{ path: '/blog',                  priority: '0.8', changefreq: 'weekly'  },
	{ path: '/gratis-website-check',  priority: '0.7', changefreq: 'monthly' },
	{ path: '/privacy',               priority: '0.3', changefreq: 'yearly'  },
	{ path: '/algemene-voorwaarden',  priority: '0.3', changefreq: 'yearly'  },
];

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	let blogSlugs = [];

	try {
		blogSlugs = await serverClient.fetch(
			`*[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
		);
	} catch {
		// Sanity unavailable — continue with static pages only
	}

	const urls = [
		...staticPages.map(({ path, priority, changefreq }) =>
			`  <url>
    <loc>${SITE}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
		),
		...blogSlugs.map(({ slug, _updatedAt }) =>
			`  <url>
    <loc>${SITE}/blog/${slug}</loc>
    <lastmod>${_updatedAt.slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
		)
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
