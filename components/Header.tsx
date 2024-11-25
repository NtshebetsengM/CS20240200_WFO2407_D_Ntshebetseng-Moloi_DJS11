
import styles from "../styles/Header.module.css"
import { Links, NavLink } from "react-router-dom"

export function Header() {
    return (
      <header className={styles.header}>
          <div><h2 className={styles.logo}> ListenUp </h2> </div>
          <div>
            <svg className={styles.hamburgerIcon} xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none">
                <path d="M4 18L20 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                <path d="M4 12L20 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                <path d="M4 6L20 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            </svg>
           </div>
           <nav className= {styles.navLinks} >
                <NavLink to="/">Home</NavLink>
                <NavLink to="favourites">Favourites</NavLink>
                <NavLink to="filter">Genres</NavLink>
                <NavLink to="reset">reset</NavLink>

           </nav>
           
      </header>
  
  )
  }
  
  