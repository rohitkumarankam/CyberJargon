import { db } from '$lib/server/db';
import { acronyms } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const data = await db.select().from(acronyms).all();
	return new Response(JSON.stringify(data));
};
