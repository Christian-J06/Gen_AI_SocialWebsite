import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Roast this social media post in a funny, witty, and slightly mean way. Be creative, concise, and direct. Here is the post: "${content}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const roast = response.text();

        return NextResponse.json({ roast });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to generate roast" }, { status: 500 });
    }
}
