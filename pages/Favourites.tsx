import { useFavourite } from "../custom-hooks/useFavourite"; // Import the custom hook
import { Loading } from "../components/Loading";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { useState } from "react";
import { Toolbar } from "../components/Toolbar";
import styles from "../styles/Favourites.module.css";
import { Link } from "react-router-dom";

export function Favourites() {
  const { favourites, removeFavourite, resetFavourites, loading, error } = useFavourite(); // Use the custom hook

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("A-Z");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);


  // Filter and sort favourites based on search, genres, and sort options
  const filteredFavourites = favourites.filter((favourite) => {
    if (selectedGenres.length > 0) {
      return selectedGenres.some((genre) => favourite.showTitle.includes(genre)); // Adjust genre logic as needed
    }
    return favourite.episodeTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedFavourites = filteredFavourites.sort((a, b) => {
    switch (sortOption) {
      case "A-Z":
        return a.showTitle.localeCompare(b.showTitle);
      case "Z-A":
        return b.showTitle.localeCompare(a.showTitle);
      case "Newest":
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case "Oldest":
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      default:
        return 0;
    }
  });

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay />;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })} ${date.toLocaleTimeString('en-ZA', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })}`;
  };

  return (
    <div>
  <h1 className={styles.heading}>Your Favourites</h1>

  <Toolbar
    searchQuery={searchQuery}
    onSearchChange={(e) => setSearchQuery(e.target.value)}
    sortOption={sortOption}
    onSortChange={(e) => setSortOption(e.target.value)}
    toggleFilterCard={() => setIsOpen(!isOpen)}
    genres={[]} // Add genres if available
    selectedGenres={selectedGenres}
    setSelectedGenres={setSelectedGenres}
    isFilterOpen={isOpen}
  />

  <button
    onClick={() => {
      const confirmReset = window.confirm(`Are you sure you want to reset your favourites?`);
      if (confirmReset) {
        resetFavourites(); // Clear all favourites (adjust hook for bulk removal if needed)
      }
    }}
    className={styles.resetRemoveBtn}
  >
    Reset Favourites
  </button>

  {favourites.length === 0 ? (
    <div className={styles.favContainer}>
      <p>No favourites yet!</p>
      <Link to="/" className="link-button">
        Discover new podcasts!
      </Link>
    </div>
  ) : (
    <div className={styles.favContainer}>
      {sortedFavourites.map((fav) => (
        <div key={`${fav.episodeTitle}-${fav.showTitle}`} className={styles.favCard}>
          <h3>{fav.episodeTitle}</h3>
          <p>Show: {fav.showTitle}</p>
          <p>Added: {formatDate(fav.addedAt)}</p>
          <button onClick={() => removeFavourite(fav.episodeTitle, fav.showTitle)}
            className={styles.resetRemoveBtn}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )}
</div>

  );
}
