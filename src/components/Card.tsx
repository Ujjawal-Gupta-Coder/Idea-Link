import React from 'react'
import Image from 'next/image'

type Session = {
  expires: string
  user:{
  email: string
  image: string
  name: string
  }
}

const formatExpires = (expire: string):string => {
    const date = new Date(expire);

    const formatted = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
    return formatted;
}

const Card = ({session} : {session: Session|null}) => {
  if(!session) return <></>
  return (
    <div className='border-2 border-pink-900 hover:bg-gray-700 group rounded-2xl flex flex-col justify-center items-center gap-4 p-2'>
     
        <Image src={session.user.image} alt={session.user.image || "Profile Picture"} height={150} width={150} className='rounded-full border-sky-800 border-2'/>

        <section className='flex flex-col items-center justify-center'>
            <h2>{session.user.name}</h2>
            <p className='text-lg'>{session.user.email}</p>
            <p className='text-xl text-gray-700 group-hover:text-gray-400'>Session Expires</p>
            <p className='text-lg'>{formatExpires(session.expires)}</p>

        </section>
    </div>
   
  )
}

export default Card
