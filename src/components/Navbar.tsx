import { auth } from "@/auth";
import SignIn from "./SignIn"
import SignOut  from "./SignOut"
import Toggle from "./ToggleButton"
import { Button } from "./ui/button";
import UserIcon from "./UserIcon";
import UserMenu from "./UserMenu";
import Image from "next/image";

export default async function Navbar () {
  const session = await auth();
   console.log(session)
  return (
    <header className="flex px-2 py-1 items-center justify-between">
     <div className=" relative">
        
            <Image src={"/logo-light.png"}  alt="Idea Link" height={20} width={100} className="block dark:hidden"/>
            <Image src={"/logo-dark.png"}  alt="Idea Link" height={20} width={100} className="hidden dark:block"/>
        
      </div>
        
      {/* {
        session?.user ? 
        <div className="flex items-center justify-center">
            <Button>Create</Button>
            <SignOut />
            <div className="relative h-[40px] w-[40px] rounded-full"><Image src={"/user-avatar-male.png" || session?.user?.image} alt={session?.user.name || "Profile picture"} fill /></div>
            <Toggle />
        </div> : 
        <div>
          <SignIn />
        </div>
      } */}

      {/* <UserIcon />  */}
      <UserMenu />
    </header>
  )
}
