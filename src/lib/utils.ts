import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import imageUrlBuilder from '@sanity/image-url'
import { client } from "@/sanity/lib/client"
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { GoogleGenAI } from "@google/genai"

const builder = imageUrlBuilder(client);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFallbackAvatar = (name: string): null|string => {
  if(!name) return null; 

  const split = name.split(" ");
  const size = split.length;

  if(size == 1) return split[0]?.toUpperCase()[0];
  else return split[0]?.toUpperCase()[0] + split[size-1]?.toUpperCase()[0];
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getImageLink(source: SanityImageSource) {
    return builder.image(source);
}


export function generateUniqueSlug(name:string, option?:{hard?: boolean, type?: string}) {
  if (!name) return "";

  name = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const digit = option?.hard ? 6: 3;

  const code = String(Math.floor(Math.random() * (10**digit))).padStart(digit, "0");

  return `${name}${option?.type === "startup" ? "~" : "-"}${code}`;
}

 export const generateWithFallback = async (prompt: string) => {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash"];
  const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

  for (const model of models) {
    try {
      return await ai.models.generateContent({
        model,
        contents: prompt,
      });
    } catch (error) {
      console.error(`${model} failed`, error);
    }
  }

  throw new Error("All models failed");
};


export const generateKeywords_geminiAI = async ({title, description, category, pitch}:{title:string|undefined, description:string|undefined, category:string|undefined, pitch:string|undefined}) => {
  try {

    if(!title && !description && !category) return [];
  const prompt = `
    You generate exactly 10 MID-LEVEL category keywords for startup recommendation.

    Your keywords must be:
    - NOT too specific (avoid niche features, product names, or narrow use-cases)
    - NOT too generic (avoid words like: tech, business, platform, app, service)
    - MID-LEVEL categories that can group multiple similar startups
    - 1–2 words only
    - Broad enough to match related startups, but specific enough to separate unrelated ones
    - No duplicates
    - EXACTLY 10 keywords
    - Output ONLY the keywords separated by commas

    Here is your target balance:
    - Too specific: ❌ "cricket bat customization", "AI diabetes predictor"
    - Too generic: ❌ "technology", "application", "company", "tool"
    - Perfect mid-level: ✔ "sports", "health", "finance", "education", "wellness", "analytics"

    Use that standard when generating keywords.

    Startup Info:
    Title: ${title}
    Category: ${category}
    Pitch: ${pitch}
    Description: ${description}
  `;


  const response = await generateWithFallback(prompt);

  return response.text ? response.text.split(", ") : [];
  } 
  catch(error) {
      console.error("Error in generating Keywords for startup: ", error);
      return [];
    }
}