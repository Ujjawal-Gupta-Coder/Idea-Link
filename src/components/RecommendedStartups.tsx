"use client";

import { client } from "@/sanity/lib/client";
import {
  KEYWORDS_FROM_STARTUP_ID_QUERY,
  MOST_VIEWED_STARTUP_QUERY,
  RECOMMENDED_STARTUP_QUERY,
} from "@/sanity/lib/queries";
import React, { useEffect, useState } from "react";
import StartupCard from "./StartupCard";
import { StartupCardType } from "@/types";
import Image from "next/image";

type KeywordsResponse = {
  keywords: string[];
};

const RecommendedStartups = ({
  headline,
  startups,
}: {
  headline: string;
  startups: StartupCardType[];
}) => {
  const [recommended, setRecommended] = useState<StartupCardType[]>([]);

  const getTopKeywords = (keywords: string[], topN = 5) => {
    const freq: { [key: string]: number } = {};

    keywords.forEach((k) => {
      freq[k] = (freq[k] || 0) + 1;
    });

    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([keyword]) => keyword);

    return sorted.slice(0, topN);
  };
  const getRecommendedStartups = async () => {
    try {
      const raw = localStorage.getItem("recentlyViewed");
      if (!raw) {
        setRecommended([]);
        return;
      }

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        console.warn("Invalid recentlyViewed format. Resetting...");
        localStorage.removeItem("recentlyViewed");
        setRecommended([]);
        return;
      }

      const ids = parsed.map((startup) => {
        return startup._id;
      });

      const keywordsResponse: KeywordsResponse[] = await client.fetch(
        KEYWORDS_FROM_STARTUP_ID_QUERY,
        { ids }
      );
      const keywords: string[] = keywordsResponse
        .flatMap((obj) => obj.keywords)
        .filter((keyword) => keyword !== null);
      const topKeywords = getTopKeywords(keywords);

      if (topKeywords) {
        const { query, params } = RECOMMENDED_STARTUP_QUERY(topKeywords);
        const response = await client.fetch(query, params);
        setRecommended(response);
      } else {
        setRecommended([]);
      }

    } catch (error) {
      console.warn("Error in getting top recommended startups", error);
      setRecommended([]);
    }
  };
  const getMostViewedStartups = async () => {
    try {
      const response = await client.fetch(MOST_VIEWED_STARTUP_QUERY);
      setRecommended(response);
    } catch (error) {
      console.warn("Error in getting most viewed startups", error);
      setRecommended([]);
    }
  };

  useEffect(() => {
    if (startups.length > 0) {
      setRecommended(startups);
    } else {
      getRecommendedStartups();
      if (recommended.length <= 0) getMostViewedStartups();
    }
  }, []);

  if (!recommended || recommended.length <= 0) return null;
  return (
    <section className="section_container">
      <div className="flex items-center gap-3">
        <p className="font-semibold text-[25px] text-black">{headline}</p>
        <div className="flex">
          <Image
            src={"/gemini_ai_icon.png"}
            alt="AI Icon"
            height={20}
            width={20}
          />
          <span className="text-zinc-500 text-[9px] font-bold">
            Powered by AI
          </span>
        </div>
      </div>

      <div className="mt-7 flex gap-6 pb-4 hide-scrollbar overflow-x-scroll">
        {recommended.map((post) => (
          <StartupCard key={post._id} post={post} forRecentView={true} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedStartups;
