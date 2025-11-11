import { auth } from '@/auth';
import StartupCardSkeleton from '@/components/ui/StartupCardSkeleton';
import UserStartups from '@/components/UserStartups';
import { getImageLink } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_USERNAME_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

const page = async ({params}: {params: Promise<{username: string}>}) => {
  const {username} = await params;
  const session = await auth();
  const user = await client.fetch(AUTHOR_BY_USERNAME_QUERY, {username});

  if(!user) return notFound();
  return (
    <section className='profile_container'>
     <div className='flex flex-col gap-4 items-center'> 
        <div className="profile_card">
        <div className="profile_title">
          <h3 className="text-24-black uppercase text-center line-clamp-1">
            {user.name}
          </h3>
        </div>
        
       
        <div className='relative w-[220px] h-[220px] profile_image'>
          <Image
            src={user.image ? getImageLink(user.image).url() : '/user-placeholder.png'}
            alt={user.name}
            fill
          />
        </div>

        <p className="text-30-extrabold mt-7 text-center">
          @{user?.username}
        </p>
        
        <Link href={`mailto:${user.email}`} className='mt-1 text-center'>
          <span className='text-black-100 text-sm'>Email:</span> 
          <span className='text-black font-bold text-sm hover:text-accent'>{user?.email}</span>
        </Link>

        <p className="mt-2 text-center text-14-normal">{user?.bio}</p>

      </div>

      {
        session?.user && session.user.email === user.email &&
        <Link href={`/user/edit/${user.username}`} 
              className="bg-neutral text-black hover:bg-primary-100 cursor-pointer hover:text-black font-semibold rounded-xl px-4 py-2"> 
          Update Profile 
        </Link>
      }
     </div>
      

      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {session?.user && session.user.email === user.email ? "Your" : "All"} Startups
          </p>
          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={user._id} email={user.email!} />
            </Suspense>
          </ul>
        </div>

    </section>
  )
}

export default page

