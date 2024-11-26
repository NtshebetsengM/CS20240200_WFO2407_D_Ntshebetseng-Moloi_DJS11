import styles from "../styles/Home.module.css"
import { useState, useEffect } from "react"

//podcasts need to be sorted alphabetically
//preview img
export function Home() {

  const previewApiUrl = 'https://podcast-api.netlify.app'  
  //const genreApiUrl = `https://podcast-api.netlify.app/genre/${id}` //<ID> refers to specific id of object
  //const showApiUrl = `https://podcast-api.netlify.app/id/${id}`
  
  const [ podcasts, setPodcasts] = useState([])
  const [ loading, setLoading ] = useState(true)
  const [error, setError ] = useState(null)
 
  
  useEffect(() =>{
      fetch(previewApiUrl)
      .then(res => 
        { 
          if(!res.ok){
            throw new Error("Data fetching failed")
          }
          return res.json()
        })
      .then(data => {
        setPodcasts(data)
        setLoading(false)
      
      })
      .catch((error) => {
        console.error('failed to fetch data', error)
        setError(error.message)
        setLoading(false)
      
      })
  },[])


  if(loading) {return <h1>Loading...</h1>}
  if(error){
    return <h1>something went wrong</h1>
  }


  return (
    <>
    <h1>Discover New Podcasts</h1>
    <div className={styles.container}>
        
        <input type="text" placeholder="looking for something?" className={styles.searchInput}/>
          <button className={styles.searchBtn}>
              <img src="assets\svgs\search.svg" alt="" className={styles.icon} />
          </button>
            
        <button className={styles.filterBtn}>
            <img src="assets\svgs\filter.svg" alt="" className={styles.icon} />
        </button>

    </div>
        
        <ul className={styles.podcastList}>
        {podcasts.sort((a, b)=> a.title.localeCompare(b.title)).map((item) =>(
            <li key={item.id} className={styles.podcastList_item}>
                <img src={item.image} alt="" className={styles.image} />
                <h2>{item.title}</h2>
                <p>seasons{item.seasons} | genre</p>
                <p>{item.updated}</p>
            </li>
        ))}
          
        </ul>

    </>

)
}

