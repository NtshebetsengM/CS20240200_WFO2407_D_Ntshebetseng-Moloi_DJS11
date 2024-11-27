import {Link} from "react-router-dom"


export default function NotFound() {
    return (
      <div className="not-found-container">
        <h1>Oh no! your lost...</h1>
        <h2>The page you were looking for does not exist.</h2>
        <Link to="/" className="link-button">Return to Home</Link>
      </div>
    )
  }
  