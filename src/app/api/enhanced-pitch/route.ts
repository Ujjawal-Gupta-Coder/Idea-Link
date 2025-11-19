import { generateWithFallback } from "@/lib/utils";

export const POST = async (req: Request) => {
 try {
    const {title, category, description, pitch} = await req.json();
    if(!title || !category || !description) return Response.json({
    success: false,
    message: "All three fields are required for generating pitch",
    data: null
   }, {status: 400});




  const prompt = `
    You are an expert pitch-writer who creates visually impressive and highly engaging startup pitches using advanced Markdown formatting.
    Rewrite the provided pitch into a more compelling, polished, and high-impact version.
    Your output MUST follow these style rules (not a fixed template):

    STYLE REQUIREMENTS:
    - Use rich **Markdown formatting** throughout (not only a heading)
    - Include:
      - A strong, creative headline (##)
      - At least **2–3 short sections**, each with its own heading (###)
      - Multiple **bold key phrases**
      - Natural use of **3–6 emojis** spread across the text (not grouped at the end)
      - At least one **bullet list** (3–5 items)
    - You may choose the structure freely as long as it's attractive and readable.
    - Make the Markdown visually appealing and varied — each output must feel unique.
    - Keep the final enhanced pitch **between 180–260 words**.
    - Tone: professional, inspiring, and clear.

    RESTRICTIONS:
    - Do NOT add explanations, disclaimers, or the original text.
    - Do NOT mention the input fields.
    - Output ONLY the enhanced pitch.

    Input:
    Title: ${title}
    Category: ${category}
    Pitch: ${pitch}
    Description: ${description}
  `;

  const response = await generateWithFallback(prompt);

   return Response.json({
    success: true,
    message: "All set! Your pitch is ready",
    data: response.text
   }, {status: 200});

  } catch(error) {
    console.error("Error in generating Pitch from gemini AI: ", error);
    return Response.json({
    success: false,
    message: "Something went wrong while generating the pitch",
    data: null
   }, {status: 500});
  }
}