import { client } from '@/sanity/lib/client';
import { STARTUPS_BY_AUTHOR_QUERY } from '@/sanity/lib/queries';
import React from 'react'
import StartupCard from './StartupCard';
import { auth } from '@/auth';
import { STARTUPS_BY_AUTHOR_QUERYResult } from '@/sanity/types';

const UserStartups = async ({id, email}: {id: string, email: string}) => {
   const startups: STARTUPS_BY_AUTHOR_QUERYResult = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });
   const session = await auth();

   const showMenu = session && session.user?.email === email ? true : false;
  return (
    <>
      {startups.length > 0 ? (
        startups.map((startup) => (
          <StartupCard key={startup._id} post={startup} showMenu={showMenu} />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  )
}

export default UserStartups
