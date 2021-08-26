import NextHead from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import {
	Analytics,
	DateLabel,
	fetchAnalytics,
	fetchContentPaginated,
	fetchSiteWithContentCount,
	Head,
	IContent,
	ISite,
	Pagination,
	Prebuilt,
} from '@pinpt/react';

import config from '../pinpoint.config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Post from '../components/Post';

interface HomeProps {
	site: ISite;
	content: IContent[];
	after?: IContent;
	analytics: Analytics;
	pageCount: number;
}

export default function Home(props: HomeProps) {
	const { site, content, after, analytics, pageCount } = props;
	const router = useRouter();
	const title = site.theme?.description ? `${site.theme.description} - ${site.name}` : site.name;

	return (
		<>
			<NextHead>
				<title>{title}</title>
				<Head site={site} />
			</NextHead>
			
			<div>
				<Header site={site} />
			</div>
			
			<div>
				<section className="w-full py-16 bg-white">
					<div className="px-10 mx-auto max-w-7xl">
						{/* TOP */}
						<div className="text-center mb-10">
							<h2 className="relative inline-block px-5 py-2 mb-5 text-4xl font-bold font-extrabold bg-white border-2 border-black rounded">
								<div className="absolute w-full rounded-lg py-2 h-full inset-0 border-2 border-black bg-black ml-2 mt-2" />
								<div className="absolute inset-0 w-full h-full py-2 bg-white" />
								<span className="relative">Latest Entries</span>
							</h2>
						</div>

						{/* CONTENT */}
						<div className="grid grid-cols-12 gap-8">
							{props.content ? props.content.map(row => (
								<Post key={row.id} content={row} />
							)) : null}
						</div>

						{/* PAGINATION */}
						<div className="mt-10 flex items-center">
							<span className="flex-grow" />
							<a onClick={after ? () => router.push(`/entries/2/${after.dateAt}/${pageCount}`) : undefined} className="relative h-6 group">
								<span className="relative z-10 px-5 py-2 font-bold leading-tight text-black bg-white border-4 border-gray-900 rounded-lg group-hover:bg-blue-100 cursor-pointer">
									Next
								</span>
								<span className="absolute top-0 right-0 w-full h-10 -mr-1 bg-black rounded-lg" />
							</a>
						</div>
					</div>
				</section>
			</div>

			<div>
				<Footer site={site} />
			</div>
		</>
	);
}

export async function getStaticProps() {
	const { site, content, after } = await fetchContentPaginated(config, {
		limit: config.pageSize,
		after: true,
		site: true,
	});

	const [{ count }, analytics] = await Promise.all([
		fetchSiteWithContentCount(config),
		fetchAnalytics(
			config,
			content.map((e) => e.id)
		),
	]);

	const pageCount = Math.ceil(count / config.pageSize);

	return {
		props: {
			site,
			content,
			after,
			analytics,
			pageCount,
		},
		revalidate: 60, // TODO: set low and cache on proxy
	};
}
