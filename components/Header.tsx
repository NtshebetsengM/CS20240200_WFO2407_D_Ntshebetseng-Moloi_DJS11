//@ts-check
import styles from "../styles/Header.module.css"
import { NavLink } from "react-router-dom"
import { useState } from "react"

export function Header() {

    const [isOpen, setIsOpen ] = useState(false)
    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    return (
      <header className={styles.header}>
          <div><h2 className={styles.logo}> ListenUp </h2> </div>
          <div>
            <button className={styles.hamburgerIcon} onClick={toggleSidebar}>
                <svg  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none">
                    <path d="M4 18L20 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M4 12L20 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M4 6L20 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>
           </div>
           <nav className= {styles.navLinks} >
                <NavLink to="/" >Home</NavLink>
                <NavLink to="favourites"> Favourites</NavLink>
           </nav>
           <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="favourites"> Favourites</NavLink>
           </div>
      </header>
  
  )
  }
  
  