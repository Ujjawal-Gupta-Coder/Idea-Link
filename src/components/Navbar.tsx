import { auth } from "@/auth";
import SignIn from "./SignIn"
import SignOut  from "./SignOut"

const Navbar = async () => {
   const session = await auth();
  return (
    <header>
        <nav className="flex justify-between px-12 py-2 bg-gray-200 h-navbar">
            <span className="font-bold text-2xl text-black">Idea Link</span>


              {
                session?.user ? 
                  <ul className="flex gap-3.5 items-center">
                    <li className="border-1 cursor-pointer px-2 py-1 rounded-2xl bg-amber-200 font-semibold text-black"> Create Post </li>
                    <li className="border-1 cursor-pointer px-2 py-1 rounded-2xl bg-sky-200 font-semibold text-black"> {session.user.name} </li> 
                    <SignOut />
                  </ul>
                :
                  <SignIn />
              }
        </nav>
    </header>
  )
}

export default Navbar
