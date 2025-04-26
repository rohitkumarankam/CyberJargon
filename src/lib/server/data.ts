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
			'### Key Features:\n\n* Simplifies package management\n* Handles dependencies automatically\n* Supports various package sources (repositories)\n\n### Usage:\n\n* `apt-get`: Command-line tool for package management\n* `apt-cache`: Tool for searching and displaying package information\n* `apt-key`: Tool for managing package keys\n\n',
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
	},
	{
		slug: 'cloud-native-application-protection-platform',
		acronym: 'CNAPP',
		full_form: 'Cloud-Native Application Protection Platform',
		description:
			'CNAPP is a security solution designed to protect cloud-native applications throughout their lifecycle. It integrates various security tools and practices to ensure the security of applications deployed in cloud environments.',
		markdown:
			'## Cloud-Native Application Protection Platform (CNAPP)\n\nThe Cloud-Native Application Protection Platform (CNAPP) is a security solution designed to protect cloud-native applications throughout their lifecycle. It integrates various security tools and practices to ensure the security of applications deployed in cloud environments.\n\n### Key Features:\n\n* Comprehensive security for cloud-native applications\n* Integration of various security tools and practices\n* Continuous monitoring and assessment of application security\n\n### Usage:\n\n* Protects applications from development to production\n* Ensures compliance with security standards and regulations\n* Provides visibility into application security posture\n\n',
		related: []
	},
	{
		slug: 'pluggable-authentication-module',
		acronym: 'PAM',
		full_form: 'Pluggable Authentication Module',
		description:
			'PAM is a framework that provides a way to develop authentication-related programs in a modular fashion. It allows system administrators to choose how applications authenticate users without modifying the applications themselves.',
		markdown: '#todo',
		related: []
	},
	{
		slug: 'privileged-access-management',
		acronym: 'PAM',
		full_form: 'Privileged Access Management',
		description:
			'Privileged Access Management (PAM) refers to the processes and technologies used to control and monitor access to critical systems and sensitive information by privileged users. PAM solutions help organizations manage and secure privileged accounts, ensuring that only authorized users have access to sensitive resources.',
		markdown: '#todo',
		related: []
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

async function syncwithsearch() {
	const axiosinstance = axios.create({
		baseURL: process.env.PUBLIC_MEILISEARCH_URL,
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + process.env.MEILISEARCH_KEY
		}
	});
	try {
		await axiosinstance.delete('/indexes/acronyms');
		await axiosinstance.post('/indexes', {
			uid: 'acronyms',
			primaryKey: 'slug'
		});
		await axiosinstance.post('/indexes/acronyms/documents?primaryKey=slug', acronyms);
		console.log('success');
	} catch (e) {
		console.log(e);
	}
}
