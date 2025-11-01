import { auth } from '@/auth'
import StartupForm from '@/components/StartupForm';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await auth();

  if (!session?.user) {
     redirect("/");
  }
  return (
    <>
      <section className="hero_container !min-h-[230px]">
        <h1 className="heading">Create your startup pitch</h1>
      </section>
      <StartupForm />
    </>
    
  )
}

export default page
