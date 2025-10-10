import { auth } from "@/auth"

const page = async () => {
  const session = await auth();
  console.log("the session is ", session)

  return (
    <div>
      Implemented Light/Dark Mode
      
      
    </div>
  )
}

export default page
