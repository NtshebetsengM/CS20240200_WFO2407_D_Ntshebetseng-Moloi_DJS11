import { useState, useEffect, useRef } from "react";

interface Favourite {
  episodeTitle: string;
  showTitle: string;
  addedAt: string; // New field to store the timestamp
}

export function useFavourite() {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState<string | null>(null)
  const isInitialRender = useRef(true);

  // Load favourites from localStorage on initial render
  useEffect(() => {
    setLoading(true)
    try{
      const savedFavourites = JSON.parse(localStorage.getItem("favourites") || "[]");
      setFavourites(savedFavourites);
      setLoading(false)
    } catch(err){
      setError("Failed to load favourites")
      console.error(err)
      setLoading(false)
    }
    
  }, []);

  // Save favourites to localStorage whenever they change
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    setLoading(true); // Set loading to true when data is being saved
    try {
      localStorage.setItem("favourites", JSON.stringify(favourites));
      setLoading(false); // Set loading to false when data has been saved
    } catch (err) {
      setError("Failed to save favourites")
      console.error(err)
      setLoading(false); 
    }
  }, [favourites]);

  // Add a new favourite with the current timestamp
  const addFavourite = (episodeTitle: string, showTitle: string) => {
    const newFavourite: Favourite = {
      episodeTitle,
      showTitle,
      addedAt: new Date().toISOString(), // Add the current time
    };
    setFavourites((prevFavourites) => [...prevFavourites, newFavourite]);
  };

  // Remove a favourite
  const removeFavourite = (episodeTitle: string, showTitle: string) => {
    const confirmRemove = window.confirm(`are you sure you want to remove ${episodeTitle} from your favourites?`)
    if(confirmRemove){
    setFavourites((prevFavourites) =>
      prevFavourites.filter(
        (fav) => fav.episodeTitle !== episodeTitle || fav.showTitle !== showTitle
      )
    );}
  };
//Reset favourites
  const resetFavourites = () => {
    setFavourites([]); // Reset the state to an empty array
    localStorage.setItem("favourites", JSON.stringify([])); // Clear the localStorage as well
  };


  return { favourites, addFavourite, removeFavourite, resetFavourites, loading, error };
} 
