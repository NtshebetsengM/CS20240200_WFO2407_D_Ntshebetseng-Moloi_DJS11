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
  const previewApiUrl = 'https://podcast-api.netlify.app';
  const genreApiUrl = (id: number) => `https://podcast-api.netlify.app/genre/${id}`; // Endpoint with genre ID
  
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [genres, setGenres] = useState<{ id: number; title: string }[]>([]); // State to store genres
  const [podcastsWithGenres, setPodcastsWithGenres] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [sortOption, setSortOption] =useState<string>('A-Z')
  const [favourites, setFavourites] = useState<string[]>([])


  // Fetch podcasts
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

  // Fetch genres (assuming you have genre IDs)
  const genreIds = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Hardcoded genre IDs, or fetch them dynamically from a different endpoint

  useEffect(() => {
    // Fetch genre data for each ID
    Promise.all(
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
              genre: validGenres.join(' | ') // Join multiple genres into a comma-separated string
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
        });
    }
  }, [podcasts]);
  
  useEffect(() => {
    const savedFavourites = JSON.parse(localStorage.getItem('favourites') || '[]');
    setFavourites(savedFavourites);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  if (loading) {
    return <h1>Loading...</h1>;
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

  

  function handleFilterClick(genre:string){
      setSelectedGenres([genre])
  }

  const filteredPodcasts = podcastsWithGenres.filter((podcast) =>{
    if(selectedGenres.length === 0 ) return true
    return selectedGenres.some((genre) => podcast.genre.includes(genre))
  })

  function handleSortChange (event: React.ChangeEvent<HTMLSelectElement>) {
    setSortOption(event.target.value)
  }

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
  // const favouritedPodcasts = sortedPodcasts.filter((podcast) =>
  //     favourites.includes(podcast.id)
  // )


  return (
    <>
      <h1>Discover New Podcasts</h1>
      <div className={styles.container}>
        <input type="text" placeholder="Looking for something?" className={styles.searchInput} />
        <button className={styles.searchBtn}>
          <img src="assets/svgs/search.svg" alt="" className={styles.icon} />
        </button>
        <button className={styles.filterBtn} onClick={toggleFilterCard}>
          <img src="assets/svgs/filter.svg" alt="" className={styles.icon} />
        </button>

        <label htmlFor="sort"></label>
        <select name="sort" id="sort" onChange={handleSortChange}>
          <option value="A-Z"> A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>
      </div>

      <div className={`${styles.filters} ${!isOpen ? styles.hidden : ''}`}>
        {genres.length > 0 ? (
          genres.map((genre) => (
            <button key={genre.id} onClick={() => handleFilterClick(genre.title)}
            className={selectedGenres.includes(genre.title) ? styles.selected : ''}>
              {genre.title} 
            </button>
          ))
        ) : (
          <p>No genres available</p>
        )}
        <div>
          <button className={styles.clearBtn} onClick={() => setSelectedGenres([])}>
            clear
          </button>
        </div>
      </div>
      <ul className={styles.podcastList}>
        {sortedPodcasts
          .map((item) => {
            const isFavourite = favourites.includes(item.id)
            return (
            <li key={item.id}>
              <button className={styles.podcastList_item}>
                <img src={item.image} alt="" className={styles.image} />
                <h2>{item.title} | <button onClick={() => toggleFavourite(item.id)} 
                className={`${styles.favBtn} ${isFavourite ? styles.favourite : ''}`}>fav</button></h2>
                <p>seasons {item.seasons}</p>
                <p>{item.genre}</p>
                <p>{formatDate(item.updated)}</p>
              </button>
            </li>
          )})}
      </ul>
    </>
  );
}
