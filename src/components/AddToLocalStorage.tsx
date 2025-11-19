'use client'

import { StartupCardType } from "@/types";
import { useEffect } from "react";

const AddToLocalStorage = ({post}: {post: StartupCardType}) => {
    
    useEffect(() => {
        try {
            const raw = localStorage.getItem("recentlyViewed");
            const current: StartupCardType[]  = raw ? JSON.parse(raw): [];
            
            const filtered = current.filter((curr) => {
                return curr._id !== post._id;
            })

            const newEntry = {
                _createdAt: post._createdAt,
                views: post.views,
                author: post.author,
                title: post.title,
                category: post.category,
                image: post.image,
                description: post.description,
                slug: post.slug,
                _id: post._id,
            };

            const updated = [newEntry, ...filtered].slice(0,5);
            localStorage.setItem("recentlyViewed", JSON.stringify(updated));
        } 
        
        catch(err) {
            console.error("Failed to store recently viewed: ", err);
        }
        
    }, [post]);

    return null
}

export default AddToLocalStorage
