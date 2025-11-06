import { auth } from "@/auth";
import { generateUniqueSlug } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_EMAIL_QUERY, STARTUP_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";

type SimpleFormData = {
  title?: string,
  description?: string,
  category?: string,
  image?: File|null,
  pitch?: string
}

export async function POST(req:Request) {
    const formData = await req.formData();
    const session = await auth();

    if(!session?.user) return Response.json( {
      success: false,
      message: "Token not provided",
      data: null
    }, {status: 401}) 
    
    const dataFields = [
    {
      label: "title",
      required: true

    }, 
    {
      label: "description",
      required: true

    }, 
    {
      label: "category",
      required: true

    }, 
    {
      label: "image",
      required: false

    }, 
    {
      label: "pitch",
      required: false

    }];

    const simpleData: SimpleFormData = {};

    // Check for all required fields are present
    for(let i=0; i<dataFields.length; i++) {
      const {label, required} = dataFields[i];
        if(required && !formData.get(label)) {
        return Response.json( {
          success: false,
          message: `${label[0].toUpperCase() + label.slice(1)} not provided`,
          data: null,
        }, {status: 400}) 
      }

      simpleData[label] = formData.get(label);
    }

    try {
      const author = await client.fetch(AUTHOR_BY_EMAIL_QUERY, {email: session.user.email});
      
      if(!author?._id) {
          return Response.json( {
            success: false,
            message: "User does not exist",
            data: null
          }, {status: 404}) 
      }
      const authorId = author?._id;

      // image should be uploaded to sanity assets 
      let imageAsset = null;
      if(simpleData.image) {
        const image = simpleData.image;
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        imageAsset = await writeClient.assets.upload("image", buffer, { filename: image.name });
      }

      // genearate Slug
      let slug;
      let attempt = 5;
      let found = false;
      while(attempt > 0) {
        slug = generateUniqueSlug(simpleData.title!, {type: "startup"});
        const alreadyTaken = await client.fetch(STARTUP_BY_SLUG_QUERY, {slug});
        if(!alreadyTaken) {
          found = true;
          break;
        }
        attempt--;
      }
      
      if(!found) {
        slug = generateUniqueSlug(simpleData.title!, {hard: true, type: "startup"});
      }


      // Finally create the startup
      const result = await writeClient.create({...simpleData,
        _type: "startup",
        views: 0,
        slug,
        author: {
          _type: "reference",
          _ref: authorId,
        },
        image: imageAsset ? {
          _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset._id,
            },
        } : null
      });
      
      return Response.json( {
          success: true,
          message: "Startup pitch created successfully",
          data: result
        }, {status: 201});
      } 
    catch(err) {
        console.error("Error in create startup: ", err)

        return Response.json( {
          success: false,
          message: "Internal Server Error",
          data: null
        }, {status: 500}) 
    }
}