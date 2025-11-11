import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY, AUTHOR_BY_USERNAME_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";

type SimpleFormData = {
  name?: string,
  username?: string,
  bio?: string,
  image?: File|null
}

export const PATCH = async (req: Request) => {
    const formData = await req.formData()
    const session = await auth();

    try {
        if(!session?.user) 
        return Response.json({
        success: false,
        message: "User not authenticated",
        data: null
        }, {status: 401})

    const requiredFields = [
        {
            label: "name",
            required: true
        },
        {
            label: "username",
            required: true
        },
        {
            label: "bio",
            required: false
        },
        {
            label: "image",
            required: false
        }
    ]

    const userId = String(formData.get("id"));

    if(!userId) return Response.json({
        success: false,
        message: "User ID not provided",
        data: null
    }, {status: 401})
     
    const user = await client.fetch(AUTHOR_BY_ID_QUERY, {id: userId});

    if(!user || !user.email) return Response.json({
        success: false,
        message: "User not found",
        data: null
    }), {status: 404}


    if(user.email !== session.user.email) return Response.json({
        success: false,
        message: "User not authorized",
        data: null
    }), {status: 401}


    const simpleFormData: SimpleFormData = {};

    for(let i=0; i<requiredFields.length; i++) {
        const {label, required} = requiredFields[i];

        if(required && formData.get(label) === null) {
            return Response.json( {
              success: false,
              message: `${label[0].toUpperCase() + label.slice(1)} not provided`,
              data: null,
            }, {status: 400}) 
        }

        if(label === "image") {
            const formImage = formData.get("image");
            if(formImage) {
                if(formImage === "null") {
                    simpleFormData.image = null
                }
                else simpleFormData[label] = formImage;
            }
        }

        else simpleFormData[label] = formData.get(label);
    }

    // image should be uploaded to sanity assets 
        let imageAsset = null;
        if(simpleFormData.image) {
        const image = simpleFormData.image;
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        imageAsset = await writeClient.assets.upload("image", buffer, { filename: image.name });
        }
        
        if(imageAsset) {
        simpleFormData.image = {
            _type: "image",
            asset: {
                _type: "reference",
                _ref: imageAsset._id,
            },
        } 
        }

        // validate Slug
        const alreadyTaken = await client.fetch(AUTHOR_BY_USERNAME_QUERY, {username: simpleFormData.username});
        if(alreadyTaken && alreadyTaken._id && alreadyTaken._id !== userId) {
            return Response.json( {
            success: false,
            message: "username already taken, try something else",
            data: null
        }, {status: 400});
        } 

    const result = await writeClient.patch(userId).set(simpleFormData).commit();

    return Response.json( {
              success: true,
              message: "User profile updated successfully",
              data: result
            }, {status: 200});
    
    } catch (err) {
        console.error("Error in edit user: ", err);
        return Response.json({
            success: false,
            message: "Internal server error",
            data: null
        }, {status: 500});
    }
    
}