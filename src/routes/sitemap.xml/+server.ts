import acronyms from '$lib/server/data';

let pages = ['/'];

export async function GET({ request }) {
	const headers = {
		'Content-Type': 'application/xml'
	};
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
			.map(
				(item) => `
        <url>
            <loc>https://${request.headers.get('host')}${item}</loc>
        </url>`
			)
			.join('')}
	${acronyms
		.map(
			(item) => `
		<url>
		  <loc>https://${request.headers.get('host')}/${item.slug}</loc>
		</url>`
		)
		.join('')}
	</urlset>`;

	return new Response(xml, { headers });
}
// https://www.sitemaps.org/protocol.html
