import { auth } from "@/auth";
import SignIn from "./SignIn"
import SignOut  from "./SignOut"
import Toggle from "./ToggleButton"
import UserMenu from "./UserMenu";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFallbackAvatar, getImageLink } from "@/lib/utils"
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_EMAIL_QUERY } from "@/sanity/lib/queries";
import { AUTHOR_BY_EMAIL_QUERYResult } from "@/sanity/types";

export default async function Navbar () {
  const session  = await auth();
  let user: AUTHOR_BY_EMAIL_QUERYResult | null = null;
  if(session?.user) {
      user = await client.fetch(AUTHOR_BY_EMAIL_QUERY, {email : session.user.email});
  }

  return (
    <header className="px-5 py-3 bg-white-100 h-[72px] shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <Image src={"/logo-light.png"} alt="Logo" height={20} width={100} className="block dark:hidden" />
          <Image src={"/logo-dark.png"} alt="Logo" height={20} width={100}  className="hidden dark:block"/>
        </Link>

        <div className="flex items-center justify-center gap-5 text-black">
          <Toggle />
          {
            user ? 
            <>
            <div className="block md:hidden">
              <UserMenu user={user}/>
            </div>


            <div className="hidden md:flex items-center justify-between gap-8 ml-8">
             <Link href={"/startup/create"} className="bg-primary hover:bg-secondary text-white hover:text-black font-semibold rounded-xl px-4 py-2">
               <span className="max-sm:hidden">Create</span>
             </Link>


             <div className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-xl px-4 py-2">
                <SignOut />
              </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/user/${user.username}`}>
                  <Avatar className="size-10 border-2 border-accent">
                    <AvatarImage src={user.image ? getImageLink(user.image).url() : undefined} alt={user?.name || ""} />
                    <AvatarFallback> {getFallbackAvatar(user?.name || "") || "AA"} </AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{user.name ? user.name+"'s" : "User"} Profile</p>
              </TooltipContent>
            </Tooltip>
             

            </div>
            </>
            : 
            <SignIn />
          }
           
        </div>

        
      </nav>
    </header>
  )
}
