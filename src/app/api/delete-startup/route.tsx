import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";

export const DELETE = async (req: Request) => {
      const {startup_id, email} = await req.json();
      const session = await auth();

      try {
          if(!session?.user || session.user.email !== email) 
          return Response.json({
            success: false,
            message: "Unauthorized access or invalid user",
            data: null
          }, {status: 401});

        await writeClient.delete(startup_id);

        return Response.json({
          success: true,
          message: "Startup post deleted successfully",
          data: null
        }, {status: 200})
        
      } catch(err) {
        console.error("Error in Deleting a startup: ", err);
        return Response.json({
          success: false,
          message: "Internal server error",
          data: null
        }, {status: 500})
      }
}