import { formatDate, getImageLink } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  AUTHOR_BY_EMAIL_QUERY,
  FETCH_COMMENTS_BY_STARTUP_ID,
} from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import CommentForm from "./CommentForm";
import { sanityFetch } from "@/sanity/lib/live";

const CommentSection = async ({ postId, authorId, userEmail }: { postId: string, authorId: string, userEmail: string | null }) => {

  const {data: comments} = await sanityFetch({query: FETCH_COMMENTS_BY_STARTUP_ID, params: {id: postId}});
  const user = userEmail ? await client.fetch(AUTHOR_BY_EMAIL_QUERY, {email: userEmail}) : null;

  if (!postId) return null;
  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      {user && <CommentForm postId={postId} user={user} />}

      {/* Comments list */}
      <div className="space-y-6">
        {
          !comments || comments.length <= 0 ? 
          <div> No comments yet </div>
          : 
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              {/* Avatar */}

              <Link
                href={`/user/${comment.author!.username}`}
                className="w-10 h-10 rounded-full overflow-hidden relative"
              >
                <Image
                  src={
                    comment.author!.image
                      ? getImageLink(comment.author!.image).url()
                      : "/user-placeholder.png"
                  }
                  alt={comment.author!.name || "User Picture"}
                  fill
                  className="object-cover rounded-full"
                />
              </Link>

              {/* Comment content */}
              <div>
                <Link
                  href={`/user/${comment.author!.username}`}
                  className="text-[12px] md:text-sm "
                >
                  {comment.author!.name}{" "}
                  {authorId && comment.author!._id === authorId && (
                    <span className="text-[11px] md:text-sm bg-primary-100 px-2 py-0.5 rounded-full mx-1">
                      Author
                    </span>
                  )}
                  <span className="text-gray-500 font-normal text-[11px] md:text-sm">
                    • {formatDate(comment._createdAt)}
                  </span>
                </Link>
                <p className="text-black-100 mt-1">{comment.message}</p>
              </div>
            </div>
          ))
        }
        
      </div>
    </div>
  );
};

export default CommentSection;
