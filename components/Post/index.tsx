import { useRouter } from 'next/router';
import React from 'react';
import { DateLabel, IContent } from '@pinpt/react';

export interface PostProps {
	content: IContent;
	highlight?: boolean;
}

const Post = (props: PostProps) => {
	const row = props.content;
	const router = useRouter();

	return (
		<div className={`relative col-span-12 duration-150 ease-out transform border-2 border-black cursor-pointer md:col-span-6 lg:col-span-4 hover:scale-105 ${props.highlight ? 'bg-black' : ''}`}>
			{row.coverMedia?.placeholderImage ? (
				<a onClick={() => router.push(new URL(row.url).pathname)} className="block h-64 overflow-hidden">
					<img
						src={row.coverMedia?.placeholderImage}
						className="object-cover w-full h-64"
						alt={row.headline}
					/>
				</a>
			) : null}

			<div className="p-5 pb-6">
				<h2 className="mb-2">
					<span onClick={() => {
						router.push(new URL(row.url).pathname);
					}} className={`text-2xl font-bold leading-tight tracking-tight ${props.highlight ? 'text-white' : ''}`}>
						{row.title}
					</span>
				</h2>
				<p className={`mb-2 text-sm font-medium tracking-widest ${props.highlight ? 'text-gray-300' : 'text-gray-500'}`}>
					Written on <DateLabel className="Prebuilt" ts={row.publishedAt} />
				</p>
				<p onClick={() => {
					router.push(new URL(row.url).pathname);
				}} className={`${props.highlight ? 'text-gray-100' : 'text-gray-700'}`}>
					<span>
						{row.headline}
					</span>
				</p>
			</div>
		</div>
	);
};

export default Post;
