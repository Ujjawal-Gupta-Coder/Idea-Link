import { auth } from "@/auth"
import Card from "@/components/Card"

const page = async () => {
  const session = await auth();
  console.log("the session is ", session)

  return (
    <div className="flex items-center justify-center font-bold text-4xl h-home-page w-full">
      {
        session?.user ? 
        <Card session={session}/> 
        : 
        <p>You Are not Logged in !!</p> 
      }
      
      
    </div>
  )
}

export default page
