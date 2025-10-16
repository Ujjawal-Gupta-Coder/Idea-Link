import SearchForm from "@/components/SearchForm"

const page = async ( ) => {
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
        // All startups card 
      </section>
    </>
  )
}

export default page
