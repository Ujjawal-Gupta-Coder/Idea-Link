"use client"

import { useEffect } from "react";

const ViewClient = ({id}: {id:string}) => {
    
    useEffect(() => {
  const increment = async () => {
    await fetch("/api/increment-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),

    });
  };

  increment();
}, [id]);

  return null
}

export default ViewClient
