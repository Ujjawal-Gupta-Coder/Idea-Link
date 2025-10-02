
import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/" })
      }}
    >
      <button type="submit" className="border-1 cursor-pointer px-2 py-1 rounded-2xl bg-pink-200 font-semibold text-black">Signin with Google</button>
    </form>
  )
} 