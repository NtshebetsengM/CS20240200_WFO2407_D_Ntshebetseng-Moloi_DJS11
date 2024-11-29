import { ErrorDisplay } from "../components/ErrorDisplay";
import { Season, Episode } from "../components/interfaces/types";
import { useFavourite } from "../custom-hooks/useFavourite";
import styles from "../styles/SeasonDetail.module.css";
import { Loading } from "../components/Loading"; // Make sure the import path is correct

interface EpisodesListProps {
  seasons: Season[];
  selectedSeason: number | null;
  updateAudio: (file: string, title: string) => void;
  showTitle: string;
}

export function EpisodesDetail({ seasons, selectedSeason, updateAudio, showTitle }: EpisodesListProps) {
  const { favourites, addFavourite, removeFavourite, loading, error } = useFavourite(); // Hook for managing favorites

  const handleEpisodeSelect = (episode: Episode) => {
    updateAudio(episode.file, episode.title);
    console.log("Episode selected:", episode.file, episode.title);
  };

  const toggleFavourite = (episode: Episode) => {
    const favouriteItem = {
      episodeTitle: episode.title,
      showTitle: showTitle,
    };

    // Check if the episode is already a favourite
    const exists = favourites.some(
      (fav) =>
        fav.episodeTitle === favouriteItem.episodeTitle &&
        fav.showTitle === favouriteItem.showTitle
    );

    // If it exists (it's already a favourite), remove it
    if (exists) {
      // Remove it from favourites
      removeFavourite(favouriteItem.episodeTitle, favouriteItem.showTitle);
    } else {
      // If not, add it to favourites
      addFavourite(favouriteItem.episodeTitle, favouriteItem.showTitle);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Display error message if there is an error
  if (error) {
    return <ErrorDisplay />;
  }

  return (
    <div>
      {seasons
        .filter((season) => selectedSeason === null || season.season === selectedSeason)
        .map((season: Season) => (
          <div key={season.season}>
            <h2>{season.title}</h2>
            {season.episodes.map((episode) => (
              <div key={episode.episode}>
                <h3>
                  {episode.title}{" "}
                  <button
                    onClick={() => toggleFavourite(episode)}
                    className={
                      favourites.some(
                        (fav) =>
                          fav.episodeTitle === episode.title &&
                          fav.showTitle === showTitle
                      )
                        ? styles.favourite
                        : ""
                    }
                  >
                    {favourites.some(
                      (fav) =>
                        fav.episodeTitle === episode.title &&
                        fav.showTitle === showTitle
                    )
                      ? "Unfav"
                      : "Fav"}
                  </button>
                  <button
                    onClick={() => {
                      handleEpisodeSelect(episode);
                      console.log("Play clicked", episode.title);
                    }}
                  >
                    Play
                  </button>
                </h3>
                <p>{episode.description}</p>
                <hr />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
