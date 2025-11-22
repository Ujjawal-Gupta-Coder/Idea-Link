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
    You are an expert at categorizing startups into broad but meaningful themes.  
Generate EXACTLY 10 mid-level category keywords to help match similar startups.

Rules for every keyword:
- lowercase only
- exact one word only
- mid-level category (not too generic, not too specific)
- no repeating or overlapping ideas
- avoid ultra-specific phrases like: "ai diabetes predictor", "nft cricket tickets"
- should be useful for grouping similar startups
- must reflect the startup’s domain, problem, audience, and context
- output ONLY the 10 keywords separated by commas

Good examples of mid-level keywords:  
sports, health, finance, education, wellness, ai tools, analytics, travel, sustainability, security

Startup Info:
Title: ${title}
Category: ${category}
Pitch: ${pitch}
Description: ${description}
  `;


  const response = await generateWithFallback(prompt);

  return response.text ? response.text.toLowerCase().split(", ") : [];
  } 
  catch(error) {
      console.error("Error in generating Keywords for startup: ", error);
      return [];
    }
}