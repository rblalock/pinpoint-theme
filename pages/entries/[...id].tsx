import NextHead from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import {
	Analytics, fetchAnalytics, fetchContentPaginated, fetchSiteWithContentCount, Head, IContent,
	ISite
} from '@pinpt/react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Post from '../../components/Post';
import config from '../../pinpoint.config';

interface PageProps {
	pageNumber: number;
	pageCount: number;
	site: ISite;
	content: IContent[];
	before?: IContent;
	after?: IContent;
	analytics: Analytics;
}

export default function Page(props: PageProps) {
	const router = useRouter();
	const { content, site, pageNumber, pageCount, before, after, analytics } = props;

	return (
		<>
			<NextHead>
				<title>{site.theme?.title ?? site.name}</title>
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
						<div className="md:grid md:grid-cols-12 md:gap-8 space-y-5 md:space-y-0">
							{content ? content.map((row) => <Post key={row.id} content={row} />) : null}
						</div>

						{/* PAGINATION */}
						<div className="mt-10 flex items-center">
							{before ? (
								<a
									onClick={() => {
										pageNumber > 2 && before
											? () => router.push(`/entries/${pageNumber - 1}/${before.dateAt}/${pageCount}`)
											: () => router.push('/');
									}}
									className="relative h-6 group"
								>
									<span className="relative z-10 px-5 py-2 font-bold leading-tight text-black bg-white border-4 border-gray-900 rounded-lg group-hover:bg-blue-100 cursor-pointer">
										Previous
									</span>
									<span className="absolute top-0 right-0 w-full h-10 -mr-1 bg-black rounded-lg" />
								</a>
							) : null}

							<span className="flex-grow" />

							{after ? (
								<a
									onClick={() => router.push(`/entries/${pageNumber + 1}/${after.dateAt}/${pageCount}`)}
									className="relative h-6 group"
								>
									<span className="relative z-10 px-5 py-2 font-bold leading-tight text-black bg-white border-4 border-gray-900 rounded-lg group-hover:bg-blue-100 cursor-pointer">
										Next
									</span>
									<span className="absolute top-0 right-0 w-full h-10 -mr-1 bg-black rounded-lg" />
								</a>
							) : null}
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

export async function getStaticPaths() {
	const { count } = await fetchSiteWithContentCount(config);
	const pages = Math.ceil(count / config.pageSize);
	const paths = [];

	let next = 0;

	for (let i = 1; i <= pages; i++) {
		const res = await fetchContentPaginated(config, {
			offset: next,
			limit: config.pageSize,
			after: true,
			projection: ['id'],
		});
		paths.push({
			params: {
				id: [`${i + 1}`, String(next), String(pages)],
			},
		});
		next = res.after?.dateAt ?? 0;
	}

	return {
		paths,
		fallback: 'blocking', // server render on-demand if page doesn't exist
	};
}

export async function getStaticProps({ params }: { params: { id: [string, string, string] } }) {
	const pageNumber = parseInt(params.id[0]);
	const offset = parseInt(params.id[1] ?? '0');
	const pageCount = parseInt(params.id[2] ?? '0');

	const res = await fetchContentPaginated(config, {
		offset,
		limit: config.pageSize,
		before: true,
		after: true,
		site: true,
	});

	const analytics = await fetchAnalytics(
		config,
		res.content.map((e) => e.id)
	);

	return {
		props: {
			site: res.site,
			content: res.content,
			before: res.before,
			after: res.after,
			pageNumber,
			pageCount,
			analytics,
		},
		revalidate: 1,
	};
}
