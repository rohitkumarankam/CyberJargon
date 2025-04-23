import { getAcronymBySlug } from '$lib/server/data';

export const load = async ({ params }) => {
	const slug = params.slug;
	// this if condition is maynot be needed
	if (!slug) {
		return {};
	}
	let acronyms = getAcronymBySlug(slug);
	return { acronym: acronyms };
};

export const ssr = true;
