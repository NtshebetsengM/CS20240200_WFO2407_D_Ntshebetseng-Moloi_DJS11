import { ErrorDisplay } from "../components/ErrorDisplay";
import { Season, Episode } from "../components/interfaces/types";
import { useFavourite } from "../custom-hooks/useFavourite";
import styles from "../styles/SeasonDetail.module.css";
import { Loading } from "../components/Loading"; 
import { useState } from "react";
import { useAudioPlayback } from "../custom-hooks/useAudioPlayback";
import { AudioPlayer } from "../components/AudioPlayer";

interface EpisodesListProps {
  seasons: Season[];
  selectedSeason: number | null;
  showTitle: string;
}

export function EpisodesDetail({ seasons, selectedSeason, showTitle }: EpisodesListProps) {
  const { favourites, addFavourite, removeFavourite, loading, error } = useFavourite(); // Hook for managing favorites
  const [currentAudio, setCurrentAudio] = useState<{
    file: string;
    title: string;
  } | null>(null);

  // Function to handle episode selection
  const handleEpisodeSelect = (episode: Episode) => {
    setCurrentAudio({ file: episode.file, title: episode.title });
    console.log("Episode selected:", episode.file, episode.title);
  };

  // Toggle favourite status for the episode
  const toggleFavourite = (episode: Episode) => {
    const favouriteItem = {
      episodeTitle: episode.title,
      showTitle: showTitle,
    };

    const exists = favourites.some(
      (fav) =>
        fav.episodeTitle === favouriteItem.episodeTitle &&
        fav.showTitle === favouriteItem.showTitle
    );

    if (exists) {
      removeFavourite(favouriteItem.episodeTitle, favouriteItem.showTitle);
    } else {
      addFavourite(favouriteItem.episodeTitle, favouriteItem.showTitle);
    }
  };

  const storedAudio = JSON.parse(localStorage.getItem("currentAudio") || "null");
  const { audioRef, handleTimeUpdate } = useAudioPlayback(storedAudio);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay />;
  }

  return (
    <div>
      {seasons
        .filter((season) => selectedSeason === null || season.season === selectedSeason)
        .map((season: Season) => (
          <div key={season.season}>
            <h2>{season.title} | {season.episodes.length} episodes</h2>
            <img src={season.image} alt="" className={styles.seasonImg} />
            {season.episodes.map((episode) => (
              <div key={episode.episode}>
                <h3>
                  {episode.title}
                  <button
                    onClick={() => toggleFavourite(episode)}
                    className={
                      favourites.some(
                        (fav) =>
                          fav.episodeTitle === episode.title &&
                          fav.showTitle === showTitle
                      )
                        ? styles.favBtn
                        : styles.favourite
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
                    className={styles.playBtn}
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
      <AudioPlayer
        currentAudio={currentAudio}
        audioRef={audioRef}
        handleTimeUpdate={handleTimeUpdate}
        onClose={() => {
          setCurrentAudio(null);
          localStorage.removeItem("currentAudio");
        }} 
      />
    </div>
  );
}
