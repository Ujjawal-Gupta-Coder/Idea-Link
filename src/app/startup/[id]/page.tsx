import { client } from '@/sanity/lib/client';
import { STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import { notFound } from 'next/navigation';
import React from 'react'

const page = async ({params}: {params: {id: string}}) => {
    const id = params.id;
    const post = await client.fetch(STARTUP_BY_ID_QUERY, {id});
    if(!post) return notFound();

  return (
    <div>
     {post.title}
    </div>
  )
}

export default page
