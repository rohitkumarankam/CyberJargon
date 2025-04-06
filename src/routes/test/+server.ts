import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const data = await db.run("SELECT name FROM sqlite_master WHERE type='table'");
	return new Response(JSON.stringify(data));
};
