import { useState, useEffect, useRef } from "react";

interface Favourite {
  episodeTitle: string;
  showTitle: string;
  addedAt: string; // New field to store the timestamp
}

export function useFavourite() {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const isInitialRender = useRef(true);

  // Load favourites from localStorage on initial render
  useEffect(() => {
    const savedFavourites = JSON.parse(localStorage.getItem("favourites") || "[]");
    setFavourites(savedFavourites);
    console.log(savedFavourites);
  }, []);

  // Save favourites to localStorage whenever they change
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    localStorage.setItem("favourites", JSON.stringify(favourites));
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


  return { favourites, addFavourite, removeFavourite, resetFavourites };
} 
