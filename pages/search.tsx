import NextHead from 'next/head';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { DateLabel, fetchSite, Head, useSearch } from '@pinpt/react';
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
						<div className="">
							{results ? results.map(row => (
								<div key={row.id} className={`relative w-full mb-10 flex items-center duration-150 ease-out transform shadow-xl border rounded-xl cursor-pointer hover:scale-105`}>
									{row.coverMedia?.placeholderImage ? (
										<a onClick={() => router.push(new URL(row.url).pathname)} className="block overflow-hidden p-5 rounded-xl">
											<img
												src={row.coverMedia?.placeholderImage}
												className="object-cover w-full h-64 rounded-xl border-4 border-black"
												alt={row.headline}
											/>
										</a>
									) : null}

									<div className="p-5 pb-6">
										<h2 className="mb-2">
											<span onClick={() => {
												router.push(new URL(row.url).pathname);
											}} className={`text-2xl font-bold leading-tight tracking-tight`}>
												{row.title}
											</span>
										</h2>
										<p className={`mb-2 text-sm font-medium tracking-widest text-gray-500`}>
											Written on <DateLabel className="Prebuilt" ts={row.publishedAt} />
										</p>
										<p className={`${props.highlight ? 'text-gray-100' : 'text-gray-700'}`}>
											<span>
												{row.headline}
											</span>
										</p>
									</div>
								</div>
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
