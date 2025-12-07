import Link from "next/link"

const Footer = () => {
  return (
    <div className="footer-container">
      <p>© 2025 IdeaLink. ⚙️ All rights reserved. ✨ Crafted with ❤️ by </p> 
      
      <Link href={"https://ujjawalgupta.vercel.app/"} className="footer-link-text">
        Ujjawal Gupta
      </Link> 
      
      <p>😊</p> 

    </div>
  )
}

export default Footer
