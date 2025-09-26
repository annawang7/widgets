import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// TODO: Add your system prompt here
const SYSTEM_PROMPT = `You are an expert frontend developer. 
Your job is to generate standalone widgets as a single HTML file.

REQUIREMENTS:
- Output only valid HTML with inline CSS and JavaScript.
- Wrap JavaScript in <script> tags and CSS in <style> tags.
- The widget must be self-contained. Do not load external libraries unless the user explicitly asks (e.g., "use three.js").
- Do not include explanations, comments, or markdown formatting. Just output the HTML code.
- The code must run inside an <iframe> with no external dependencies.
- Keep code under 200 lines if possible.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // TODO: Replace this with actual OpenAI integration
    // For now, we'll create a simple HTML response
    // When you're ready to integrate OpenAI, uncomment the code below and install the openai package

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "Create a widget that " + prompt },
      ],
      temperature: 0.7,
    });

    const htmlContent = completion.choices[0].message.content;

    return NextResponse.json({ content: htmlContent });
  } catch (error) {
    console.error("Error generating widget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
