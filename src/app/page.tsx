import SearchForm from "@/components/SearchForm"

const page = async ( ) => {
  return (
    <>
    <section className="hero_container">
        <h1 className="heading">
          Every Great Startup <br/>
          Starts With an <span className="text-transparent px-3 text-[50px] sm:text-[65px] relative sm:right-4 bg-clip-text bg-gradient-to-r from-yellow-600 via-blue-400 to-indigo-600 font-cursive">Idea</span> 
        </h1>

        <p className="sub-heading !max-w-3xl">
          Showcase your innovation, inspire investors, and turn imagination into reality.
        </p>

        <SearchForm />
      </section>

    </>
  )
}

export default page
