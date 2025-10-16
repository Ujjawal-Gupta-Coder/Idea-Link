import { auth } from "@/auth";
import SignIn from "./SignIn"
import SignOut  from "./SignOut"
import Toggle from "./ToggleButton"
import UserMenu from "./UserMenu";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFallbackAvatar } from "@/lib/utils"

export default async function Navbar () {
  const session  = await auth();
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <Image src={"/logo-light.png"} alt="Logo" height={20} width={100} className="block dark:hidden" />
          <Image src={"/logo-dark.png"} alt="Logo" height={20} width={100}  className="hidden dark:block"/>
        </Link>

        <div className="flex items-center justify-center gap-5 text-black">
          <Toggle />
          {
            session && session.user ? 
            <>
            <div className="block md:hidden">
              <UserMenu session={session}/>
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
                <Link href={'/user-profile'}>
                  <Avatar className="size-10" >
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback> {getFallbackAvatar(session.user?.name || "") || "AA"} </AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">User Profile</p>
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
