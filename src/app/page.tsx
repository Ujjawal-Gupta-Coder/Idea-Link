export const revalidate = 0;

import RecentViewStartups from "@/components/RecentViewStartups";
import SearchForm from "@/components/SearchForm"
import StartupCard from "@/components/StartupCard";
import { sanityFetch } from "@/sanity/lib/live";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import {StartupCardType} from "@/types";

const page = async ( {searchParams} : {searchParams?: Promise<{query?: string}>}) => {
  const result = await searchParams;
  const query = result?.query || null;
  
  const {data: posts} = await sanityFetch({query: STARTUPS_QUERY, params: {query}});

  return (
    <>
    <section className="hero_container">
      <p className="tag">Pitch, vote and grow</p>
        <h1 className="heading">
          Every Great Startup <br/>
          Starts With an <span className="heading-gradient-text">Idea</span> 
        </h1>

        <p className="sub-heading !max-w-3xl">
          Showcase your innovation, inspire investors, and turn imagination into reality.
        </p>

        <SearchForm />
      </section>

{/* Recently Viewed Startups  */}
{
  !query && <RecentViewStartups />
}
    

    {/* All Starups  */}
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupCardType) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-result">No startups found</p>
          )}
        </ul>
      </section>
    </>
  )
}

export default page
