'use client'
import { getImageLink } from "@/lib/utils"
import { AUTHOR_BY_EMAIL_QUERYResult } from "@/sanity/types"
import { useTheme } from "next-themes";
import Image from "next/image"
import { useState } from "react";
import { toast } from "react-toastify";

const CommentForm = ({postId, user}: {postId:string, user: AUTHOR_BY_EMAIL_QUERYResult}) => {
    const {theme} = useTheme();
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleCommentSumbmit = async () => {
      try {
        if (!message.trim()) {
          toast.error("Comment cannot be empty", {theme});
          setMessage("");
          return;
        }

        if (!user?._id) {
          toast.error("User not logged in", {theme});
          setMessage("");
          return;
        }

        if (!postId) {
          toast.error("Invalid post", {theme});
          setMessage("");
          return;
        }

        setSubmitting(true);
        const raw = await fetch("/api/add-comment", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({message, postId, userId: user?._id})
        })
        const response = await raw.json();

        if(response.success) {
          toast.success(response.message, {theme});
          setMessage("");
        } else {
          toast.error(response.message, {theme});
        }
      } catch(error) {
          console.warn("Error in posting comment", error);
          toast.error("Error in posting comment", {theme});
      } finally {
        setSubmitting(false);
      }
    }

    if(!user || !postId) return null;
  return (
    <div className="flex items-start gap-3 mb-6">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden relative">
            <Image
              src={user.image ? getImageLink(user.image).url() : "/user-placeholder.png"}
              alt={user.name || "User Picture"}
              fill
              className="object-cover rounded-full"
            />
          </div>

          <div className="flex-1">
            {/* Logged in username */}
            <p className="font-medium mb-1">{user.name}</p>

            {/* message area */}
            <textarea
              placeholder="Add a comment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCommentSumbmit();
                }
              }}
              className="w-full border-b border-gray-300 focus:border-black outline-none p-1 h-10 resize-none"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-3">
              <button onClick={() => setMessage("")} className="px-4 py-2 rounded-full hover:bg-primary-100 transition">
                Cancel
              </button>
              <button
                disabled={message.trim().length === 0 || submitting}
                className="px-4 py-2 rounded-full bg-primary disabled:bg-gray-500 text-white hover:bg-secondary cursor-pointer transition"
                onClick={handleCommentSumbmit}
              >
                {
                  submitting ? "Commenting..." : "Comment"
                }
              </button>
            </div>
          </div>
        </div>
  )
}

export default CommentForm
