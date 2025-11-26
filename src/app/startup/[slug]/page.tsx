import ProfileAvatar from '@/components/ProfileAvatar';
import { formatDate, getImageLink } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_EMAIL_QUERY, RECOMMENDED_STARTUP_QUERY, STARTUP_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import markdownit from "markdown-it";
import View from '@/components/View';
import { Skeleton } from '@/components/ui/skeleton';
import ConnectDialog from '@/components/ConnectDialog';
import { auth } from '@/auth';
import { StartupCardType } from '@/types';
import AddToLocalStorage from '@/components/AddToLocalStorage';
import RecommendedStartups from '@/components/RecommendedStartups';
import StartupSummary from '@/components/StartupSummary';
import CommentSection from '@/components/CommentSection';

const page = async ({params}: {params: Promise<{slug: string}>}) => {
    const { slug } = await params;
    const [post, session] = await Promise.all([client.fetch(STARTUP_BY_SLUG_QUERY, {slug}), auth()]);
    const {name: senderName, username: senderUsername, email: senderMail} = session?.user?.email ? await client.fetch(AUTHOR_BY_EMAIL_QUERY, {email: session.user.email}) : {name: null, username:null, email:null}

    let recommendedStartups:StartupCardType[] = [];
          
    if(post && post.keywords) {
      const {query, params} = RECOMMENDED_STARTUP_QUERY(post.keywords, post._id);
      recommendedStartups = await client.fetch(query, params);
    }
    
    const md = markdownit();
    const markdown = md.render(post?.pitch || "");
    if(!post) return notFound();
  return (
    <>
      <AddToLocalStorage post={post} />
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
          <div className="flex-between gap-5 flex-col sm:flex-row">
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

          <StartupSummary post={post}/>
          
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
        
        {
          (!session?.user || session.user.email !== post.author?.email) && 
          <ConnectDialog 
            senderName={senderName} 
            senderUsername={senderUsername} 
            senderMail={senderMail} 
            receiverName={post?.author?.name ? post.author.name : null} 
            receiverMail={post?.author?.email ? post.author.email : null} 
            startupTitle={post?.title ? post.title : null}
            startupSlug={post?.slug ? post.slug : null}
          />
        }
      
       <CommentSection postId={post._id} authorId={post.author!._id} userEmail={session?.user?.email || null} />
       <hr className="divider" />
      
      {
        recommendedStartups?.length > 0 && <RecommendedStartups headline={"More to Explore"} startups={recommendedStartups} onHomePage={false}/>
      }

        <Suspense fallback={<Skeleton className='view_skeleton' />}>
            <View id={post._id} />
        </Suspense>

      </section>
    </>
  )
}

export default page
