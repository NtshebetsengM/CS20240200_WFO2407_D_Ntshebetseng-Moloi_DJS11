//@ts-check
import { useState, useEffect } from "react"
import { Podcast } from "components/interfaces/types"
import { PodcastList } from "../components/PodcastList"
import { Toolbar } from "../components/Toolbar"
import styles from "../styles/Home.module.css"

export function Favourites() {

  const [ favourites, setFavourites ] = useState<Podcast[]>([])
  const [ loading, setLoading ] = useState(true)
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("A-Z");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

      // Search and filter logic
  const filteredFavourites = favourites.filter((podcast) => {
    if (selectedGenres.length === 0) return true;
    return selectedGenres.some((genre) => podcast.genre.includes(genre));
  });

  const sortedFavourites = filteredFavourites.sort((a, b) => {
    switch (sortOption) {
      case "A-Z":
        return a.title.localeCompare(b.title);
      case "Z-A":
        return b.title.localeCompare(a.title);
      case "Newest":
        return new Date(b.updated).getTime() - new Date(a.updated).getTime();
      case "Oldest":
        return new Date(a.updated).getTime() - new Date(b.updated).getTime();
      default:
        return 0;
    }
  });

      if (loading) {
        return <h1 className={styles.heading} >Loading...</h1>;
      }
      if (error) {
        return <h1>Something went wrong</h1>;
      }

    return (
      <div>
        <h1 className={styles.heading}>Your Favourites</h1>

        <Toolbar
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        sortOption={sortOption}
        onSortChange={(e) => setSortOption(e.target.value)}
        toggleFilterCard={() => setIsOpen(!isOpen)}
        genres={[]} // Add genres here if needed
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        isFilterOpen={isOpen}
      />
        {favourites.length === 0 ? (
        <p>No favourites yet!</p>
      ) : (
        <PodcastList
          podcasts={sortedFavourites}
          favourites={favourites.map((fav) => fav.id)}
          toggleFavourite={toggleFavourite}
          formatDate={formatDate}
        />
      )}
    </div>

      
    )
  }
  