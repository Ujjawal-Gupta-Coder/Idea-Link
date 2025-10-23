"use client"
import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react'

const SearchForm = () => {
  const searchParams = useSearchParams();
  const typingRef = useRef(false);
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const route = useRouter();

  useEffect(() => {
    if(typingRef.current) return;
    const currentQuery = searchParams.get("query") || "";
    setQuery(currentQuery);
  }, [searchParams]); 

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
      <input name="query" className="search-input"  placeholder="Search Startups" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => (typingRef.current = true)}
        onBlur={() => (typingRef.current = false)}/>

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

