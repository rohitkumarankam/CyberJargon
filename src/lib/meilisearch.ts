import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || "http://localhost:7700" as string,
  apiKey: process.env.MEILISEARCH_KEY || "" as string
});

export default client;