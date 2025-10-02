import { signOut } from "@/auth"
 
export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit" className="border-1 cursor-pointer px-2 py-1 rounded-2xl bg-pink-200 font-semibold text-black">Log Out</button>
    </form>
  )
}