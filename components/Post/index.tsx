import { useRouter } from 'next/router';
import React from 'react';
import { DateLabel, IContent } from '@pinpt/react';

export interface PostProps {
	content: IContent;
}

const Post = (props: PostProps) => {
	const row = props.content;
	const router = useRouter();

	return (
		<div key={row.id} className="relative col-span-12 duration-150 ease-out transform border-2 border-black cursor-pointer md:col-span-6 lg:col-span-4 hover:scale-105">
			{row.coverMedia?.placeholderImage ? (
				<a onClick={() => router.push(new URL(row.url).pathname)} className="block h-64 overflow-hidden">
					<img
						src={row.coverMedia?.placeholderImage}
						className="object-cover w-full"
						alt={row.headline}
					/>
				</a>
			) : null}

			<div className="p-5 pb-6">
				<h2 className="mb-2">
					<span onClick={() => {
						console.log(row.url);
						router.push(new URL(row.url).pathname);
					}} className="text-2xl font-bold leading-tight tracking-tight">
						{row.title}
					</span>
				</h2>
				<p className="mb-2 text-sm font-medium tracking-widest text-gray-500">
					Written on <DateLabel className="Prebuilt" ts={row.publishedAt} />
				</p>
				<p className="text-gray-700">
					<span>
						{row.headline}
					</span>
				</p>
			</div>
		</div>
	);
};

export default Post;
