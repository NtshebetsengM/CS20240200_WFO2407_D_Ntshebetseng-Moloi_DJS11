//@ts-check
import { useState, useEffect } from "react"
import { Podcast } from "components/interfaces/types"
import { PodcastList } from "../components/PodcastList"


export function Favourites() {

  const [ favourites, setFavourites ] = useState<Podcast[]>([])
  const [ loading, setLoading ] = useState(true)
  const [error, setError] = useState<string | null>(null);

      useEffect(()=> {
        const storedFavourites = localStorage.getItem('favourites')
        if(storedFavourites){
          const favouriteIds = JSON.parse(storedFavourites)
          fetch('https://podcast-api.netlify.app')
          .then((res) => res.json())
          .then((data) =>{
            const favouritePodcasts = data.filter((podcast:Podcast) => 
            favouriteIds.includes(podcast.id))
            setFavourites(favouritePodcasts)
            setLoading(false)
          }).catch((error) => {
            console.error('failed to fetch data', error);
            setError(error.message);
            setLoading(false);
          })
          
        }
      },[])

      const toggleFavourite = (id: string) => {
        
        setFavourites((prev) => {
          console.log("current favs", prev)
          const updatedFavourites = prev.filter((fav) => fav.id !== id); // Ensure this returns a boolean
          console.log("updated favs", updatedFavourites)
          localStorage.setItem(
            "favourites",
            JSON.stringify(updatedFavourites.map((fav) => fav.id))
          );
          return updatedFavourites;
        });
      };
      
    
      // Utility to format dates
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-ZA", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      };

      if (loading) {
        return <h1 >Loading...</h1>;
      }
      if (error) {
        return <h1>Something went wrong</h1>;
      }

    return (
      <div>
        <h1>Your Favourites</h1>
        {favourites.length === 0 ? (
        <p>No favourites yet!</p>
      ) : (
        <PodcastList
          podcasts={favourites}
          favourites={favourites.map((fav) => fav.id)}
          toggleFavourite={toggleFavourite}
          formatDate={formatDate}
        />
      )}
    </div>

      
    )
  }
  