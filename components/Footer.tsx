import "../styles/Footer.module.css"
import { Link } from "react-router-dom"

export function Footer() {
    return (
      <footer>
        <p>Discover the best podcasts, all in one place.</p>
                <Link to="/" >Home</Link> | 
                <Link to="favourites"> Favourites</Link> |
                <Link to="filter"> Genres </Link> |
                <Link to="reset"> Reset</Link>
           <p> 2024 &copy; ListenUp. All rights reserved.</p>   
           
      </footer>
  
  )
  }
  