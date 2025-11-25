'use client'

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import StartupCard from "./StartupCard";
import { StartupCardType } from "@/types";

const RecentViewStartups = () => {
    const [recent, setRecent] = useState<StartupCardType[]>([]);
    
    const clearLocalStorage = () => {
      localStorage.removeItem("recentlyViewed");
      setRecent([]);
    }
    
    useEffect(() => {
      try {
        const raw = localStorage.getItem("recentlyViewed");

        if(!raw) {
          setRecent([]);
          return;
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
          console.warn("Invalid recentlyViewed format. Resetting...");
          setRecent([]);
          localStorage.removeItem("recentlyViewed");
          return;
        }

        setRecent(parsed);

      } catch {
        console.warn("Invalid recentlyViewed format. Resetting...");
        setRecent([]);
        localStorage.removeItem("recentlyViewed");
        return;
      }
      
    }, []);

  if(!recent || recent.length <= 0) return null;
  return (
    <section className="section_container">
      <div className="flex items-center justify-between">
        <p className="text-30-semibold">
          Recently Viewed Startups
        </p>
        <button className="cursor-pointer" onClick={clearLocalStorage}> <X /> </button>
      </div>
         
      <div className="mt-7 flex gap-6 pb-4 hide-scrollbar overflow-x-scroll">
        {recent.map((post) => (
        <StartupCard key={post._id} post={post} forRecentView={true} />
      ))}
      </div>
          
      </section>
  )
}

export default RecentViewStartups
