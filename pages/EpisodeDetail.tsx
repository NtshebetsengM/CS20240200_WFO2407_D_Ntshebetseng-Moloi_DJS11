import { Season,Episode } from "../components/interfaces/types";


interface EpisodesListProps {
  seasons: Season[];
  selectedSeason: number | null;
  updateAudio: (file: string, title: string) => void;
}

export function EpisodesDetail({ seasons, selectedSeason, updateAudio }: EpisodesListProps){
  
  const handleEpisodeSelect = (episode: Episode) => {
    
    updateAudio(episode.file, episode.title);
    console.log("that the", episode.file,episode.title)
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
                  <button onClick={() => {
                    handleEpisodeSelect(episode)
                    console.log(" play clicked", episode.title)}}>Play</button>
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