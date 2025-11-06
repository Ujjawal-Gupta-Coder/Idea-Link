import ProfileAvatar from '@/components/ProfileAvatar';
import { formatDate, getImageLink } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { STARTUP_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import markdownit from "markdown-it";
import View from '@/components/View';
import { Skeleton } from '@/components/ui/skeleton';

const page = async ({params}: {params: Promise<{slug: string}>}) => {
    const { slug } = await params;
    const post = await client.fetch(STARTUP_BY_SLUG_QUERY, {slug});
    const md = markdownit();
    const markdown = md.render(post?.pitch || "");
    if(!post) return notFound();
  return (
    <>
      <section className="hero_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <div className='relative w-full aspect-[16/9] object-cover'>
            <Image
              src={post.image ? getImageLink(post.image).url() : "/no-image-placeholder.png"}
              alt="thumbnail"
              className='rounded-xl'
              fill
            />
        </div>

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?.username}`}
              className="flex gap-2 items-center mb-3"
            >
              <ProfileAvatar image={post.author?.image} name={post.author?.name} />

              <div>
                <p className="text-20-medium">{post.author?.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author?.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{post.category}</p>
          </div>

          <h3 className="text-30-bold">Pitch Details</h3>

          {markdown ? (
            <article
              className="prose dark:prose-invert max-w-4xl font-work-sans"
              dangerouslySetInnerHTML={{ __html: markdown }}
            /> 
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        
       <hr className="divider" />

        {/*💥 TODO: EDITORS RECOMMENDATIONS */}

          <Suspense fallback={<Skeleton className='view_skeleton' />}>
              <View id={post._id} />
          </Suspense>

      </section>
    </>
  )
}

export default page
