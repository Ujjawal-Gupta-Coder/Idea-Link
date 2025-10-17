import SearchForm from "@/components/SearchForm"
import StartupCard from "@/components/StartupCard";
import {StartupCardType} from "@/types/StartupCard";

const page = async ( {searchParams} : {searchParams?: {query?: string}}) => {
  const query = searchParams?.query || "";

  const posts: StartupCardType[] = [];

  // 💥 Fake data entry
  for(let i=0; i<50; i++) {
    const post:StartupCardType = {
    _createdAt:new Date(),
    views: 56,
    author:  {
        name: "Elon Musk",
        _id: "abcxyz123.com",
        image: "/elon.webp"
    },
    title: "Grok AI",
    category: "Tech",
    _id: "123abcX.com",
    image: "/grok.jpeg",
    description: "This startup is all about AI and its impact.",
  }
    posts.push(post);
  }
  return (
    <>
    <section className="hero_container">
        <h1 className="heading">
          Every Great Startup <br/>
          Starts With an <span className="heading-gradient-text">Idea</span> 
        </h1>

        <p className="sub-heading !max-w-3xl">
          Showcase your innovation, inspire investors, and turn imagination into reality.
        </p>

        <SearchForm />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupCardType, idx: number) => (
              // <StartupCard key={post?._id} post={post} />
              <StartupCard key={idx} post={post} />
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
