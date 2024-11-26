//@ts-check
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

interface Podcast {
  id: string;
  title: string;
  description: string;
  seasons: number;
  image: string;
  genres: number[];  // Assuming genres is an array of numbers (IDs)
  updated: string;
  genre: string;  // Optional field for genre (will be populated later)
}

export function Home() {

  const previewApiUrl = 'https://podcast-api.netlify.app'  
  const genreApiUrl = (id: number) => `https://podcast-api.netlify.app/genre/${id}` //<ID> refers to specific id of object
  //const showApiUrl = `https://podcast-api.netlify.app/id/${id}`
  
  const [ podcasts, setPodcasts] = useState<Podcast[]>([])
  const [ podcastsWithGenres, setPodcastsWithGenres ] = useState<Podcast[]>([])
  const [ loading, setLoading ] = useState(true)
  const [error, setError ] = useState<string | null>(null)
  const [ isOpen, setIsOpen ] = useState(false)
 
  
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

  useEffect(() => {
    // Only run this effect if podcasts have been fetched
    if (podcasts.length > 0) {
      // Create a new array for podcasts with genres
      const updatedPodcasts  = [...podcasts];

      // Fetch the genre for each podcast
      Promise.all(
        updatedPodcasts.map((podcast, index) => {
          // console.log(podcast)
          const genreId = podcast.genres[0]
          const url = genreApiUrl(genreId)
 
          // console.log(url)
         return fetch(url)
          .then(res => res.json())
          .then(data => {
            updatedPodcasts[index] = {
              ...updatedPodcasts[index],
              genre: data.title
            }
         })  
         .catch((error) => {
          console.error('error fetching genre', error)
         })
        })
      )
      .then(() => {
        // Once all genres are fetched, update the state
        setPodcastsWithGenres(updatedPodcasts);
        
      });
    }
  }, [podcasts])

  if(loading) {return <h1>Loading...</h1>}
  if(error){
    return <h1>something went wrong</h1>
  }

  const formatDate = (dateString:string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',  // Example: '2024'
      month: 'short',   // Example: 'Nov'
      day: 'numeric',   // Example: '26'
    })
  }

  function toggleFilterCard(){
    setIsOpen(!isOpen)
  }


  return (
    <>
    <h1>Discover New Podcasts</h1>
    <div className={styles.container}>
        
        <input type="text" placeholder="looking for something?" className={styles.searchInput}/>
          <button className={styles.searchBtn}>
              <img src="assets\svgs\search.svg" alt="" className={styles.icon} />
          </button>
            
        <button className={styles.filterBtn} onClick={toggleFilterCard}>
            <img src="assets\svgs\filter.svg" alt="" className={styles.icon} />
        </button>
    </div>


      <div className={`${styles.filters} ${isOpen ? styles.hidden : ''}`}>
        <button>Personal Growth</button>
        <button>Investigative Journalism</button>
        <button>History</button>
        <button>Comedy</button>
        <button>Entertainment</button>
        <button>Business</button>
        <button>Fiction</button>
        <button>News</button>
        <button>Kids and Family</button>
      </div>
      

        
        <ul className={styles.podcastList}>
        {podcastsWithGenres.sort((a, b)=> a.title.localeCompare(b.title)).map((item) =>(
            
            <li key={item.id} >
              <button className={styles.podcastList_item}>
                <img src={item.image} alt="" className={styles.image} />
                <h2>{item.title}</h2>
                <p>seasons {item.seasons} |  {item.genre} </p>
                <p>{formatDate(item.updated)}</p>
              </button>
                
            </li>
        ))}
          
        </ul>

    </>

)
}

