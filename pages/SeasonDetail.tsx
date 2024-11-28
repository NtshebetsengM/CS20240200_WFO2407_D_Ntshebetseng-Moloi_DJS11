//@ts-check
import { useEffect, useState } from "react";
import { Link,useParams } from "react-router-dom";
import { Episode, Season } from "components/interfaces/types";
import styles from "../styles/SeasonDetail.module.css"
import { useFavourites } from "../custom-hooks/useFavourite";


export function SeasonDetail() {

  const { id } = useParams<string>()
 const showApiUrl = `https://podcast-api.netlify.app/id/${id}/`


const [ loading, setLoading] = useState(true)
 const [ show, setShow ] = useState<string[]>([])
 const [ title, setTitle ] = useState<string>()
 const [ description, setDescription ] = useState<string>('')
 const [ genres, setGenre ] = useState<string[]>([])
 const [ imgSrc, setImgSrc ] = useState<string>('')
 const [ seasons, setSeason] = useState<Season[]>([])
 const [ episode, setEpisode ] = useState<Episode[]>([])
 const [ updated, setUpdated ] = useState<string>('')
 const [ selectedSeason, setSelectedSeason ] = useState<number | null>(null)
 const [favourites, setFavourites] = useFavourites()

 useEffect(() => {
  fetch(showApiUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error("Data fetching failed");
      }
      return res.json();
    })
    .then(data => {
      
      if(data && data.seasons){
        setShow(data)
        setTitle(data.title);  // Set title state
        setDescription(data.description);  // Set description state
        setGenre(data.genres);  // Set genres state
        setImgSrc(data.image);  // Set image source
        setSeason(data.seasons);  // Set seasons state
        setUpdated(data.updated)
        setEpisode(data.seasons.episodes)
        setLoading(false)
      } else {
        console.error('no seasons data available')
      }
      

    })
    .catch((error) => {
      console.error('failed to fetch data', error)
      setLoading(false)
    });
}, [showApiUrl]);

useEffect(() => {
  if (seasons.length < 0) {
    // Access episodes of the first season, for example
  console.error('fetching failed') // Access episodes for the first season
  }
  console.log(show)
}, [episode, seasons, show])

if (loading) {
  return <h1 className={styles.heading}>Loading...</h1>;
}


const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formattedDate = formatDate(updated)

function handleSeasonBtnClick(season:Season){
  setSelectedSeason(season.season)
}

function handleClearBtnClick(){
  setSelectedSeason(null)
}
function toggleFavourite(id:string){
  setFavourites((prev)=> prev.includes(id) ? prev.filter((favId) => favId !== id ) : [...prev, id]
  )
}
  
 return (
  <div className={styles.container} >
    <Link to="/" >back</Link>
     <header>
      
        <h1>{title}</h1>
        <button onClick={() => id && toggleFavourite(id)}
            className={`${styles.favBtn} ${favourites ? styles.favourite : ''}`}
          >
          {favourites.includes(id || "") ? "Unfav" : "Fav"}
          </button>
        <h2> {seasons.length} season{seasons.length > 1 ? "s!" : "!"} </h2>

        <div >
            <h3>last updated: {formattedDate}</h3>
            
            <div className={styles.show_info} >
                <img src={imgSrc}  alt="" />
                <div className={styles.descriptions} >
                    <p>{description} </p>
                    <p className={styles.genres}>{genres} </p>
                </div>
            </div>
            {/*SEASONS BUTTONS*/}
            <div className={styles.seasonsContainer} >
                {seasons.length > 0 ? (
                        seasons.map(season => (
                          <button key={season.season} className={styles.seasonBtn} onClick={() =>handleSeasonBtnClick(season)}>
                            {season.title}
                          </button>
                        ))
                      ) : (<p>No seasons available</p>)}
                      <div>
                        <button className={styles.clearBtn}
                        onClick={ handleClearBtnClick} >
                          Clear
                        </button>
                      </div>
              </div>
        </div>

      </header>

      <div>
          <div >
            {/*SEASONS AND EPISODES */}
              {seasons.length > 0 && seasons.filter((season) =>selectedSeason === null ? true : season.season === selectedSeason)
              .map((season: Season) => (
                    <div key={season.season}>
                      <h2>{season.title}</h2>
                      <div>
                        {season.episodes && season.episodes.map((episode: Episode, idx: number) => (
                          <div key={idx}>
                           
                            <h3>{episode.title}</h3>
                            <p>{episode.description}</p>
                            <hr />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
          </div>
      </div>
  </div>
 )

  }
  