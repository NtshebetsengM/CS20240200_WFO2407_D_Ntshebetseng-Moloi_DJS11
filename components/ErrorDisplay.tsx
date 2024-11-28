import { Link, useNavigate } from "react-router-dom"
import styles from "../styles/ErrorDisplay.module.css"

export function ErrorDisplay() {
const navigate = useNavigate()
   
        return (
        <div className={styles.container} >
            <h1 className={styles.heading} >Uh oh! Something went wrong</h1>
            <div className={styles.navsContainer} >
                <button onClick={()=> navigate(-1)} className={styles.goBack} >Go back</button>
                <Link to="/" className="link-button">Return to Home</Link>
            </div>

        </div>
        )
      
      
   
  }