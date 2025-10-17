
import { signIn } from "@/auth"
import { Button } from "./ui/button"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/" })
      }}
    >
      <Button type="submit" className="rounded-xl h-12 w-24 text-lg bg-primary hover:bg-secondary text-white hover:text-black cursor-pointer" > 
        Sign In
      </Button>
    </form>
  )
} 