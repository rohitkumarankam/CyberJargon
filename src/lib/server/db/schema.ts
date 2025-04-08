import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const acronyms = sqliteTable('acronyms', {
	slug: text('slug').primaryKey(),
	acronym: text('acronym').notNull(),
	full_form: text('full_form').notNull(),
	description: text('description').notNull(),
	markdown: text('markdown').notNull(),
	references_json: text('references_json'),
	related_terms_json: text('related_terms_json')
});

let example = [
	{
		slug: 'advanced-package-tool',
		acronym: 'APT',
		'full-form': 'Advanced Package Tool',
		description:
			'APT is a package management system used by Debian and its derivatives, such as Ubuntu. It simplifies the process of installing, upgrading, and removing software packages.',
		references: [
			{
				title: 'APT - Debian Wiki',
				url: 'https://wiki.debian.org/Apt'
			},
			{
				title: "APT User's Guide",
				url: 'https://help.ubuntu.com/lts/serverguide/apt.html'
			}
		],
		related: ['advanced-persistent-threat']
	},
	{
		slug: 'advanced-persistent-threat',
		acronym: 'APT',
		'full-form': 'Advanced Persistent Threat',
		description:
			'APT refers to a prolonged and targeted cyberattack in which an intruder gains access to a network and remains undetected for an extended period. APTs are often associated with state-sponsored actors or organized crime groups.',
		references: [
			{
				title: 'Advanced Persistent Threat (APT) - Wikipedia',
				url: 'https://en.wikipedia.org/wiki/Advanced_persistent_threat'
			},
			{
				title: 'Advanced Persistent Threats (APT) Explained',
				url: 'https://www.crowdstrike.com/en-us/cybersecurity-101/threat-intelligence/advanced-persistent-threat-apt/'
			}
		],
		related: ['advanced-package-tool']
	}
];

let example2 = [];
