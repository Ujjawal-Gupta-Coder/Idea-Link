import { writeClient } from "@/sanity/lib/write-client";
import { STARTUP_VIEWS_BY_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const {views} = await client.fetch(STARTUP_VIEWS_BY_ID_QUERY, { id });
    const newViews = (views || 0) + 1;

    await writeClient.patch(id).set({ views: newViews }).commit();

    return Response.json({ views: newViews }); 
  } 
  catch (err) {
    console.error("Increment-view API error:", err);
    return Response.json(
      { error: "Failed to increment views", details: String(err) },
      { status: 500 }
    );
  }
}
