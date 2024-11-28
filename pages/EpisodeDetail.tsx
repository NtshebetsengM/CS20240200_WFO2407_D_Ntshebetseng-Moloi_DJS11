import { Season, Episode } from "../components/interfaces/types";
import { useFavourites } from "../custom-hooks/useFavourite";
import styles from "../styles/SeasonDetail.module.css";

interface EpisodesListProps {
  seasons: Season[];
  selectedSeason: number | null;
  updateAudio: (file: string, title: string) => void;
  showTitle: string;
}

export function EpisodesDetail({ seasons, selectedSeason, updateAudio, showTitle }: EpisodesListProps) {
  const [favourites, setFavourites] = useFavourites(); // Hook for managing favorites

  const handleEpisodeSelect = (episode: Episode) => {
    updateAudio(episode.file, episode.title);
    console.log("Episode selected:", episode.file, episode.title);
  };

  const toggleFavourite = (episode: Episode) => {
    const favouriteItem = {
      episodeTitle: episode.title,
      showTitle: showTitle,
    };
  
    setFavourites((prev) => {
      const exists = prev.some(
        (fav) =>
          fav.episodeTitle === favouriteItem.episodeTitle &&
          fav.showTitle === favouriteItem.showTitle
      );
  
      return exists
        ? prev.filter(
            (fav) =>
              fav.episodeTitle !== favouriteItem.episodeTitle ||
              fav.showTitle !== favouriteItem.showTitle
          )
        : [...prev, favouriteItem];
    });
  };
  

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
