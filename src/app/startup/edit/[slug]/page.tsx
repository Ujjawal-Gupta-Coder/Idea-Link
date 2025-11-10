import { auth } from '@/auth';
import StartupForm from '@/components/StartupForm';
import { client } from '@/sanity/lib/client';
import { STARTUP_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import { notFound, redirect } from "next/navigation";
import React from 'react'

const page = async({params}: {params: Promise<{slug: string}>}) => {
    const {slug:urlSlug} = await params;
    const[startup, session] =  await Promise.all([client.fetch(STARTUP_BY_SLUG_QUERY, {slug:urlSlug}), auth()]);
    
    if(!startup) {
        return notFound();
    } 
    if(!session?.user || session.user.email !== startup.author!.email) 
       return redirect("/");

    const {title, description, category, image, pitch, slug, _id:id, views} = startup;
  return (
    <>
        <section className="hero_container !min-h-[230px]">
        <h1 className="heading">Edit your startup pitch</h1>
        </section>
        <StartupForm isEditMode={true} initialValue={{title, description, category, image, pitch, slug, id, views}} />
    </>
  )
}

export default page
