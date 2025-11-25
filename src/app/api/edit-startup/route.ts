import { auth } from "@/auth";
import { generateKeywords_geminiAI } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_STARTUP_ID_QUERY, STARTUP_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client"

type SimpleFormData = {
  title?: string,
  description?: string,
  category?: string,
  image?: File | null,
  keywords?: string[],
  pitch?: string,
  slug: string,
  views: number,
}

export const PATCH = async (req: Request) => {

  const formData = await req.formData();
  const session = await auth();
  if (!session?.user) return Response.json({
    success: false,
    message: "Token not provided",
    data: null
  }, { status: 401 })

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
      label: "slug",
      required: true

    },
    {
      label: "views",
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

  const startupId = String(formData.get("id"));

  // validate startup id 
  const startupAuthor = await client.fetch(AUTHOR_BY_STARTUP_ID_QUERY, { id: startupId });
  if (!startupAuthor) {
    return Response.json({
      success: false,
      message: "Author does not exist for this startup",
      data: null
    }, { status: 404 })
  }

  // user authorization check
  if (!startupAuthor.author && startupAuthor.author!.email !== session.user.email) return Response.json({
    success: false,
    message: "User not authorized",
    data: null
  }, { status: 401 })


  const simpleData: SimpleFormData = {};

  // Check for all required fields are present
  for (let i = 0; i < dataFields.length; i++) {
    const { label, required } = dataFields[i];
    if (required && formData.get(label) === null) {
      return Response.json({
        success: false,
        message: `${label[0].toUpperCase() + label.slice(1)} not provided`,
        data: null,
      }, { status: 400 })
    }

    if (label === "views") simpleData[label] = Number(formData.get(label));
    else if (label === "image") {
      if (formData.get(label) === 'null') {
        simpleData[label] = null;
      }
      else if (formData.get(label)) {
        simpleData[label] = formData.get(label);
      }
    }
    else simpleData[label] = formData.get(label);
  }

  try {
    // image should be uploaded to sanity assets 
    let imageAsset = null;
    if (simpleData.image) {
      const image = simpleData.image;
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageAsset = await writeClient.assets.upload("image", buffer, { filename: image.name });
    }

    if (imageAsset) {
      simpleData.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      }
    }

    // validate Slug
    const alreadyTaken = await client.fetch(STARTUP_BY_SLUG_QUERY, { slug: simpleData.slug });
    if (alreadyTaken && alreadyTaken._id && alreadyTaken._id !== startupId) {
      return Response.json({
        success: false,
        message: "URL Slug already taken, try something else",
        data: null
      }, { status: 400 });
    }

    // geting keywords
    simpleData.keywords = await generateKeywords_geminiAI({title:simpleData.title, category:simpleData.category, description:simpleData.description, pitch:simpleData.pitch});
    
    const result = await writeClient.patch(startupId).set(simpleData).commit();

    return Response.json({
      success: true,
      message: "Startup pitch updated successfully",
      data: result
    }, { status: 200 });
  }
  catch (err) {
    console.error("Error in update startup: ", err)

    return Response.json({
      success: false,
      message: "Internal Server Error",
      data: null
    }, { status: 500 })
  }
}