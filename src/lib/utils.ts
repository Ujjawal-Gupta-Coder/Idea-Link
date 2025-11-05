import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import imageUrlBuilder from '@sanity/image-url'
import { client } from "@/sanity/lib/client"
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

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