import { auth } from "@/auth"

const page = async () => {
  const session = await auth();
  console.log("the session is ", session)

  return (
    <div>
      Fixed global.css
      
      
    </div>
  )
}

export default page
