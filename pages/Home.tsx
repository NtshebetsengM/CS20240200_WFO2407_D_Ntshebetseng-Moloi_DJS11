//@ts-check
import React, { useEffect, useState } from "react";
import { useFavourites } from "../custom-hooks/useFavourite";
import styles from "../styles/Home.module.css";
import { Toolbar } from "../components/Toolbar"
import { PodcastList } from "../components/PodcastList"
import { Podcast } from "components/interfaces/types";



export function Home() {
  const previewApiUrl = 'https://podcast-api.netlify.app';
  const genreApiUrl = (id: number) => `https://podcast-api.netlify.app/genre/${id}`; 
  
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [genres, setGenres] = useState<{ id: number; title: string }[]>([]); // State to store genres
  const [podcastsWithGenres, setPodcastsWithGenres] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [sortOption, setSortOption] =useState<string>('A-Z')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [favourites, setFavourites] = useFavourites()


  // FETCH PODCASTS
  useEffect(() => {
    fetch(previewApiUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error("Data fetching failed");
        }
        return res.json();
      })
      .then(data => {
        setPodcasts(data);
        
      })
      .catch((error) => {
        console.error('failed to fetch data', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // FETCH GENRES
  const genreIds = [1, 2, 3, 4, 5, 6, 7, 8, 9]; 

  useEffect(() => {
    
    Promise.all(  //takes array of promises and runs them concurrently(waits for all to resolve or one to reject)
      genreIds.map(id =>
        fetch(genreApiUrl(id))
          .then(res => res.json())
          .then(data => {
            // Collect the genre data
            return { id, title: data.title };
          })
          .catch((error) => {
            console.error(`Failed to fetch genre for ID: ${id}`, error);
            return null;
          })
      )
    )
      .then((results) => {
        // Filter out any null results (in case there was an error fetching a genre)
        const validGenres = results.filter((result) => result !== null);
        setGenres(validGenres as { id: number; title: string }[]);
      })
      .catch((error) => {
        console.error('Error fetching genres:', error);
        setError(error.message);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs once

  // Fetch genres for each podcast
  useEffect(() => {
    if (podcasts.length > 0) {
      const updatedPodcasts = [...podcasts];
  
      // Iterate over each podcast
      Promise.all(
        updatedPodcasts.map((podcast, index) => {
          const genrePromises = podcast.genres.map((genreId: number) => {
            const url = genreApiUrl(genreId); // API to get genre by id
  
            return fetch(url)
              .then(res => res.json())
              .then(data => data.title) // Extracting genre title from API response
              .catch((error) => {
                console.error(`Error fetching genre for ID ${genreId}`, error);
                return null; // Return null in case of an error
              });
          });
  
          return Promise.all(genrePromises).then((genres) => {
            // Filter out null values if any genre fetch failed
            const validGenres = genres.filter((genre) => genre !== null);
            
            updatedPodcasts[index] = {
              ...updatedPodcasts[index],
              genre:validGenres.length ? validGenres.join(' | ') : 'Unknown' 
            };
          });
        })
      )
        .then(() => {
          setPodcastsWithGenres(updatedPodcasts);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error processing podcasts with genres:', error);
          setLoading(false)
        });
    }
  }, [podcasts]);
  
 

  if (loading) {
    return <h1 className={styles.heading}>Loading...</h1>;
  }
  if (error) {
    return <h1>Something went wrong</h1>;
  }
 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  
  
  function toggleFilterCard() {
    setIsOpen(!isOpen);
  }

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>){
	setSortOption(event.target.value)
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>){
	setSearchQuery(event.target.value)
  }
 
  const filteredPodcasts = podcastsWithGenres.filter((podcast) =>{
    if(selectedGenres.length === 0 ) return true
    return selectedGenres.some((genre) => podcast.genre.includes(genre))
  })


  const sortedPodcasts = filteredPodcasts.sort((a, b) =>{
    switch(sortOption){
      case 'A-Z':
        return a.title.localeCompare(b.title)
      case 'Z-A':
        return b.title.localeCompare(a.title)
      case 'Newest':
        return new Date(b.updated).getTime() - new Date(a.updated).getTime()
      case 'Oldest':
        return new Date(a.updated).getTime() - new Date(b.updated).getTime()
      default:
        return 0
    }
  })

  function toggleFavourite(id:string){
    setFavourites((prev)=> prev.includes(id) ? prev.filter((favId) => favId !== id ) : [...prev, id]
    )
  }
  

  return (
    <>
       
      <h1 className={styles.heading}>Discover New Podcasts</h1>
	     {/*TOOLBAR=SEARCH-SORT-FILTER */}
			<Toolbar
			searchQuery={searchQuery}
			onSearchChange={handleSearchChange}
			sortOption={sortOption}
			onSortChange={handleSortChange}
			toggleFilterCard={toggleFilterCard}
			genres={genres}
			selectedGenres={selectedGenres}
			setSelectedGenres={setSelectedGenres}
			isFilterOpen={isOpen}
			/>


      {/*PODCAST CARD/LIST*/}
     <PodcastList
	 	podcasts={sortedPodcasts}
		favourites={favourites}
		toggleFavourite={toggleFavourite}
		formatDate={formatDate}
	 />
    </>
  );
}
