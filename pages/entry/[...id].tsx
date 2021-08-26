import NextHead from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import {
	Banner,
	fetchContent,
	fetchContentPaginated,
	Head,
	IContent,
	ISite,
	Pinpoint,
} from '@pinpt/react';
import { CoverMedia, Document } from '@pinpt/react/dist/components/Renderer';
import Link from 'next/link';

import config from '../../pinpoint.config';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface EntryPageProps {
	content: IContent;
	before: IContent;
	after: IContent;
	site: ISite;
	preview?: boolean;
}

const PreviewBanner = () => {
	return <Banner message="You are viewing an unpublished preview of your page" />;
};

export default function EntryPage(props: EntryPageProps) {
	const router = useRouter();
	const { content, site, before, after, preview } = props;

	return (
		<>
			<NextHead>
				<title>
					{content.title} - {site.name}
				</title>
				<Head site={site} content={content} />
			</NextHead>

			<Header site={site} />

			{preview && <PreviewBanner />}

			<section className="w-full py-16 bg-white">
				<div className="px-5 md:px-10 mx-auto max-w-5xl">
					<Pinpoint siteId={site.id} contentId={content.id}>
						{(_ready, ref) => (
							<>
								{content.coverMedia ? (
									<div className="mx-auto relative z-10 font-bold leading-tight text-black border-8 border-gray-900 rounded-lg mb-10">
										<CoverMedia media={content.coverMedia} title={content.title} />
									</div>
								) : null}

								<Document node={content.document} />
							</>
						)}
					</Pinpoint>

					{/* PAGINATION */}
					<div className="mt-20 flex items-center">
						{before ? (
							<a onClick={() => router.push(new URL(before.url).pathname)} className="relative h-6 group">
								<span className="relative z-10 px-5 py-2 font-bold leading-tight text-black bg-white border-4 border-gray-900 rounded-lg group-hover:bg-blue-100 cursor-pointer">
									Previous
								</span>
								<span className="absolute top-0 right-0 w-full h-10 -mr-1 bg-black rounded-lg" />
							</a>
						) : null}

						<span className="flex-grow" />

						{after ? (
							<a onClick={() => router.push(new URL(after.url).pathname)} className="relative h-6 group">
								<span className="relative z-10 px-5 py-2 font-bold leading-tight text-black bg-white border-4 border-gray-900 rounded-lg group-hover:bg-blue-100 cursor-pointer">
									Next
								</span>
								<span className="absolute top-0 right-0 w-full h-10 -mr-1 bg-black rounded-lg" />
							</a>
						) : null}
					</div>

					{/* SIGN UP */}
					<section className="py-10 px-5 mt-36 leading-7 text-gray-900 bg-white sm:py-12 md:py-16 lg:py-24 border-dashed border-3 rounded-lg">
						<div className="max-w-6xl px-10 mx-auto border-solid lg:px-12">
							<div className="flex flex-col items-start leading-7 text-gray-900 border-0 border-gray-200 lg:items-center lg:flex-row">
								<div className="box-border flex-1 text-center border-solid sm:text-left">
									<h2 className="m-0 text-xl md:text-4xl font-semibold text-center leading-tight tracking-tight text-black border-0 border-gray-200">
										Want these delivered via email?
									</h2>
									<p className="mt-2 md:text-2xl text-center md:text-left text-gray-900 border-0 border-gray-200">
										Sign up below and you will get an email digest when there is a new post.
									</p>
								</div>
								<Link passHref href="/subscription/subscribe">
									<a href="/subscription/subscribe" className="relative h-6 group mt-10 w-54 mx-auto">
										<span className="relative z-10 px-5 py-2 font-bold leading-tight text-black bg-white border-4 border-gray-900 rounded-lg group-hover:bg-blue-100 cursor-pointer">
											Signup
										</span>
										<span className="absolute top-0 right-0 w-full h-10 -mr-1 bg-black rounded-lg" />
									</a>
								</Link>
							</div>
						</div>
					</section>
				</div>
			</section>

			<Footer site={site} />
		</>
	);
}

export async function getStaticPaths() {
	const { content } = await fetchContentPaginated(config, { limit: 200, projection: ['id', 'title'] });

	return {
		paths: content.map(({ id, title }) => ({
			params: {
				id: [id, title],
			},
		})),
		fallback: 'blocking', // server render on-demand if page doesn't exist
	};
}

export async function getStaticProps({
	params,
	preview,
	previewData,
}: {
	params: { id: string; title: string };
	preview?: boolean;
	previewData?: any;
}) {
	const { content, before, after, site } = await fetchContent(config, params.id[0], {
		before: true,
		after: true,
		site: true,
		commit: preview ? previewData?.commit : undefined,
	});

	return {
		props: {
			content,
			site,
			before,
			after,
			preview: !!preview,
		},
		revalidate: 60, // TODO: set low and cache on proxy
	};
}
