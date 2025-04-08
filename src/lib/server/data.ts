import axios from 'axios';

type acronym = {
	slug: string;
	acronym: string;
	full_form: string;
	description: string;
	markdown: string;
	related: Array<acronym['acronym']>;
};

const acronyms: acronym[] = [
	{
		slug: 'advanced-package-tool',
		acronym: 'APT',
		full_form: 'Advanced Package Tool',
		description:
			'APT is a package management system used by Debian and its derivatives, such as Ubuntu. It simplifies the process of installing, upgrading, and removing software packages.',
		markdown:
			'## Advanced Package Tool (APT)\n\nThe Advanced Package Tool (APT) is a package management system used by Debian and its derivatives, such as Ubuntu. It simplifies the process of installing, upgrading, and removing software packages.\n\n### Key Features:\n\n* Simplifies package management\n* Handles dependencies automatically\n* Supports various package sources (repositories)\n\n### Usage:\n\n* `apt-get`: Command-line tool for package management\n* `apt-cache`: Tool for searching and displaying package information\n* `apt-key`: Tool for managing package keys\n\n',
		related: ['advanced-persistent-threat']
	},
	{
		slug: 'advanced-persistent-threat',
		acronym: 'APT',
		full_form: 'Advanced Persistent Threat',
		description:
			'APT refers to a prolonged and targeted cyberattack in which an intruder gains access to a network and remains undetected for an extended period. APTs are often associated with state-sponsored actors or organized crime groups.',
		markdown:
			'### Advanced Persistent Threat (APT)\n#### Definition\nAdvanced Persistent Threat (APT) refers to a prolonged and targeted cyberattack in which an intruder gains access to a network and remains undetected for an extended period.\n\n#### Characteristics\n* Prolonged and targeted cyberattack\n* Intruder gains access to a network and remains undetected for an extended period\n* Often associated with state-sponsored actors or organized crime groups\n\n',
		related: ['advanced-package-tool']
	}
];

const getAcronymBySlug = (slug: String) => {
	const acronym = acronyms.find((acronym) => acronym.slug === slug);
	if (!acronym) {
		return null;
	}
	return acronym;
};

export { getAcronymBySlug, syncwithsearch };
export default acronyms;

function syncwithsearch() {
	const axiosinstance = axios.create({
		baseURL: process.env.PUBLIC_MEILISEARCH_URL,
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + process.env.MASTER_KEY
		}
	});
	try {
		axiosinstance.delete('/indexes/acronyms');
		axiosinstance.post('/indexes', {
			uid: 'acronyms',
			primaryKey: 'slug'
		});
		axiosinstance.post('/indexes/acronyms/documents?primaryKey=slug', acronyms);
		console.log('success');
	} catch (e) {
		console.log(e);
	}
}
