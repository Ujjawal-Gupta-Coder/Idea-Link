import Image from 'next/image'
import React from 'react'

const ProfileAvatar = ({image, name}:{image:string|undefined, name:string|undefined}) => {
  return (
    
    <div className="h-16 w-16 relative flex justify-center items-center p-[3px]">
        <div className='absolute h-full w-full bg-gradient-to-tr from-secondary via-primary to-neutral rounded-full animate-spin'></div>
        
        <div className='relative w-full h-full rounded-full overflow-hidden drop-shadow-lg'>
            <Image
                src={image}
                alt={name || "User Picture"}
                fill
                className="object-cover"
            />
        </div>
        
    </div>
  )
}

export default ProfileAvatar
