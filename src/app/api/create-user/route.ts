import { generateUniqueSlug } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_EMAIL_QUERY, AUTHOR_BY_USERNAME_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";

export const POST = async (req:Request) => {
 
    const user = await req.json();
    const {email, name, image} =  user;
    if(!name || !email) return Response.json({
            success: false,
            message: 'Failed to authenticate user',
            data: null
          }, {status: 401});

          const result = await client.fetch(AUTHOR_BY_EMAIL_QUERY, {email});
          if(!result) {

            // get username
            let username;
            let attempt = 5;
            let found = false;
            while(attempt > 0) {
              username = generateUniqueSlug(name);
              const alreadyTaken = await client.fetch(AUTHOR_BY_USERNAME_QUERY, {username});
              if(!alreadyTaken) {
                found = true;
                break;
              } 
              attempt--;
            }
            if(!found) {
              username = generateUniqueSlug(name,{hard: true})
            }

            // get image
            let profilePicture = null;
            if(image) {
                const response = await fetch(image);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                profilePicture = await writeClient.assets.upload("image", buffer, { filename: username });
            }

            // create new user
            await writeClient.create({
              _type: "author",
              name,
              email,
              username,
              bio: "",
              image: profilePicture ? {
                _type: "image",
                  asset: {
                    _type: "reference",
                    _ref: profilePicture._id,
                  },
              } : null
            })

            return Response.json({
            success: true,
            message: "New user has been created successfully",
            data: null
          }, {status: 201});
        }


          else return Response.json({
            success: true,
            message: "User Sign In successfully",
            data: null
          }, {status: 200});
}