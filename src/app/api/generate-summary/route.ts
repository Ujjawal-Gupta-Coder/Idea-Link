import { generateWithFallback } from "@/lib/utils";

export const POST = async (req: Request) => {

    try {

        const { title, category, description, pitch } = await req.json();

        if (!title || !category || !description) return Response.json({
            success: false,
            message: "All three fields are required for generating summary",
            data: null
        }, { status: 400 });


        const prompt = `
    You are an expert startup analyst.  
Your task is to generate a crisp, clear, and professional summary of a startup.

Output Requirements:
- The summary MUST be exactly TWO paragraphs.
- Each paragraph should contain 2–3 sentences.
- Total 4–6 sentences maximum.
- Do NOT add imaginary information.
- Do NOT repeat points.
- Only use the details provided.
- No headings, no bullet points — only two clean paragraphs.

    Input:
    Title: ${title}
    Category: ${category}
    Pitch: ${pitch}
    Description: ${description}
  `;

        const response = await generateWithFallback(prompt);

        return Response.json({
            success: true,
            message: "All set! Your startup summary is ready",
            data: response.text
        }, { status: 200 });
    } catch (error) {
        console.error("Error in generating Pitch from gemini AI: ", error);
        return Response.json({
            success: false,
            message: "Something went wrong while generating the summary",
            data: null
        }, { status: 500 });
    }
}