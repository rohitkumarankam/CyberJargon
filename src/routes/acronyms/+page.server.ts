import { getAllAcronyms } from '$lib/server/data';

export const load = () => {
	let acronyms = getAllAcronyms();
	return { acronyms };
};

export const ssr = true;
