import { Season } from "../components/interfaces/types";

interface EpisodesListProps {
  seasons: Season[];
  selectedSeason: number | null;
  updateAudio: (file: string, title: string) => void;
}

export function EpisodesDetail({ seasons, selectedSeason, updateAudio }: EpisodesListProps){
  return (
  <div>
    {seasons
      .filter((season) => selectedSeason === null || season.season === selectedSeason)
      .map((season) => (
        <div key={season.season}>
          <h2>{season.title}</h2>
          {season.episodes.map((episode, idx) => (
            <div key={idx}>
              <h3>
                {episode.title}{" "}
                <button onClick={() => updateAudio(episode.file, episode.title)}>Play</button>
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