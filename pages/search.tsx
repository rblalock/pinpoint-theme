import NextHead from 'next/head';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { fetchSite, Head, useSearch } from '@pinpt/react';
import config from '../pinpoint.config';
import Header from '../components/Header';
import Footer from '../components/Footer';

import type { ISite } from '@pinpt/react';
import Post from '../components/Post';
interface SearchProps {
	site: ISite;
}

export default function Search(props: SearchProps) {
	const { site } = props;
	const router = useRouter();
	const tags = JSON.parse(decodeURIComponent((router?.query?.tags ?? '') as string) || '[]');
	const term = (router?.query?.term as string) ?? '';
	const { results } = useSearch(term, tags, config.siteId);

	const title = useMemo(
		() => `${tags.length ? tags.join(' AND ') : term}`,
		[tags, term]
	);

	console.log(results);

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
								<span className="relative">
									Search results for <em className="text-blue-500">{title}</em>
								</span>
							</h2>
						</div>

						{/* CONTENT */}
						<div className="md:grid md:grid-cols-12 md:gap-8 space-y-5 md:space-y-0">
							{results ? results.map(row => (
								<Post key={row.id} content={row} />
							)) : null}
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
	const site = await fetchSite(config);
	return {
		props: {
			site,
		},
		revalidate: 600 * 5,
	};
}
