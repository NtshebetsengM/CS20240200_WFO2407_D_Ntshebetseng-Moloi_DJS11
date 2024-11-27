//@ts-check
import React from "react";
import styles from "../styles/Toolbar.module.css";

interface ToolbarProps{
    searchQuery: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sortOption: string;
    onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    toggleFilterCard: () => void;
    genres: { id: number; title:string}[];
    selectedGenres: string[];
    setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
    isFilterOpen: boolean
}

export const Toolbar: React.FC<ToolbarProps> = ({
    searchQuery,
    onSearchChange,
    sortOption,
    onSortChange,
    toggleFilterCard,
    genres,
    selectedGenres,
    setSelectedGenres,
    isFilterOpen
}) => {
    const handleFilterClick = (genre:string) => {
        setSelectedGenres((prev) => prev.includes(genre) ? [] : [genre])
    }
    return (
        <div>
        {/* Search, Sort, Filter Toolbar */}
        <div className={styles.container}>
          <input
            type="text"
            placeholder="Looking for something?"
            className={styles.searchInput}
            value={searchQuery}
            onChange={onSearchChange}
          />
          <button className={styles.searchBtn}>
            <img src="assets/svgs/search.svg" alt="" className={styles.icon} />
          </button>
          <button className={styles.filterBtn} onClick={toggleFilterCard}>
            <img src="assets/svgs/filter.svg" alt="" className={styles.icon} />
          </button>
  
          <label htmlFor="sort"></label>
          <select name="sort" id="sort" value={sortOption} onChange={onSortChange}>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>
  
        {/* Filter Buttons */}
        <div className={`${styles.filters} ${!isFilterOpen ? styles.hidden : ''}`}>
          {genres.length > 0 ? (
            genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleFilterClick(genre.title)}
                className={selectedGenres.includes(genre.title) ? styles.selected : ''}
              >
                {genre.title}
              </button>
            ))
          ) : (
            <p>No genres available</p>
          )}
          <div>
            <button className={styles.clearBtn} onClick={() => setSelectedGenres([])}>
              Clear
            </button>
          </div>
        </div>
      </div>
    )
}