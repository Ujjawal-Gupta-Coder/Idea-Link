import { auth } from "@/auth";
import SignIn from "./SignIn"
import SignOut  from "./SignOut"
import Image from "next/image";
import Toggle from "./ToggleButton"

const Navbar = async () => {
   const session = await auth();
  return (
    <header className="flex gap-4">
      
      <button className="text-primary text-4xl font-work-sans">Idea Link</button>
      {
        session?.user ? <SignOut /> : <SignIn />
      }
      
      <Toggle />
      <button>Switch Mode</button>
    </header>
  )
}

export default Navbar
