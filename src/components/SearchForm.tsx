"use client"
import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'

const SearchForm = () => {
  const searchQuery = useSearchParams().get("query");
  const [query, setQuery] = useState(searchQuery ? searchQuery.trim() : "");
  const route = useRouter();

  useEffect(() => {
    const delay = setTimeout(() => {
        const trimed = query.trim();
        if(trimed.length === 0) route.replace("/");
        else route.replace(`/?query=${encodeURIComponent(trimed).replace(/%20/g, "+")}`, { scroll: false })
    }, 400)
    
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="search-form flex gap-2">
      <input name="query" className="search-input" placeholder="Search Startups" value={query} onChange={(e) => setQuery(e.target.value)} />

      {
        query && 
        <button type="button" className="search-btn text-white" onClick={() => setQuery("")}>
          <X className="size-5" />
        </button>
      }
      
      <button type="button" className="search-btn text-white">
         <Search className="size-5" />
       </button>
    </div>
  )
}

export default SearchForm

