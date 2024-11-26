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

      Promise.all(
        updatedPodcasts.map((podcast, index) => {
          const genreId = podcast.genres[0];
          const url = genreApiUrl(genreId); // API to get genre by id

          return fetch(url)
            .then(res => res.json())
            .then(data => {
              updatedPodcasts[index] = {
                ...updatedPodcasts[index],
                genre: data.title
              };
            })
            .catch((error) => {
              console.error('Error fetching podcast genre:', error);
            });
        })
      )
        .then(() => {
          setPodcastsWithGenres(updatedPodcasts);
          setLoading(false);
        });
    }
  }, [podcasts]);

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
console.log('click',genre)
  }

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
      </div>

      <div className={`${styles.filters} ${!isOpen ? styles.hidden : ''}`}>
        {genres.length > 0 ? (
          genres.map((genre) => (
            <button key={genre.id} onClick={() => handleFilterClick(genre.title)}>
              {genre.title}
            </button>
          ))
        ) : (
          <p>No genres available</p>
        )}
      </div>

      <ul className={styles.podcastList}>
        {podcastsWithGenres
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((item) => (
            <li key={item.id}>
              <button className={styles.podcastList_item}>
                <img src={item.image} alt="" className={styles.image} />
                <h2>{item.title}</h2>
                <p>seasons {item.seasons} | {item.genre}</p>
                <p>{formatDate(item.updated)}</p>
              </button>
            </li>
          ))}
      </ul>
    </>
  );
}
