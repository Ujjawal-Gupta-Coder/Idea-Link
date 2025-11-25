import { writeClient } from "@/sanity/lib/write-client";

export const POST = async (req: Request) => {
    try {
        const {message, postId, userId} =  await req.json();

        if (!message || !message.trim()) {
            return Response.json({
                success: false,
                message: "Comment cannot be empty",
                data: null,
            }, {status: 400})
        }

        if (!userId) {
            return Response.json({
                success: false,
                message: "User not logged in",
                data: null,
            }, {status: 400})
        }

        if (!postId) {
            return Response.json({
                success: false,
                message: "Invalid post",
                data: null,
            }, {status: 400})
        }

        const result = await writeClient.create({
            _type: "comment",
            message,
            startup: {
                _type: "reference",
                _ref: postId,
            },
            author: {
                _type: "reference",
                _ref: userId,
            },
        })

        return Response.json({
            success: true,
            message: "Comment added successfully",
            data: result
        }, {status: 201})

    } 
    catch(error) {
        console.error("Error in add comment: ", error)

        return Response.json({
          success: false,
          message: "Internal Server Error",
          data: null
        }, {status: 500}) 
    }
}