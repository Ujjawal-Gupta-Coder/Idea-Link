import { auth } from '@/auth';
import ProfileForm from '@/components/ProfileForm';
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_USERNAME_QUERY } from '@/sanity/lib/queries';
import { notFound, redirect } from 'next/navigation';
import React from 'react'

const page = async ({params}: {params: Promise<{username: string}>}) => {
    const {username} = await params;
    const [session, user] = await Promise.all([auth(), client.fetch(AUTHOR_BY_USERNAME_QUERY, {username})]);
    
    if(!user) {
      return notFound();
    }

    if(!session?.user || session.user.email !== user.email) {
      return redirect('/')
    }

  return (
    <>
      <section className="hero_container !min-h-[230px]">
        <h1 className="heading">Update your profile</h1>
        </section>

      <ProfileForm user={user} />
    </>
  )
}

export default page
