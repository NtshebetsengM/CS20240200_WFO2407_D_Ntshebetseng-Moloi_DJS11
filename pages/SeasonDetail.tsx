import { Season } from "components/interfaces/types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import styles from "../styles/SeasonDetail.module.css";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { EpisodesDetail } from "./EpisodeDetail";


export function SeasonDetail() {
  const { id } = useParams<string>();
  const showApiUrl = `https://podcast-api.netlify.app/id/${id}/`;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>("");
  const [genres, setGenre] = useState<string[]>([]);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [seasons, setSeason] = useState<Season[]>([]);
  const [updated, setUpdated] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
 
  

  useEffect(() => {
    fetch(showApiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Data fetching failed");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.seasons) {
          setTitle(data.title);
          setDescription(data.description);
          setGenre(data.genres);
          setImgSrc(data.image);
          setSeason(data.seasons);
          setUpdated(data.updated);
        } else {
          console.error("No seasons data available");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Failed to fetch data", error);
        setLoading(false);
      });
  }, [showApiUrl]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formattedDate = formatDate(updated);

  

  if (loading) return <Loading />;
  if (error) return <ErrorDisplay />;

  return (
    <div className={styles.container}>
      <Link to="/">back</Link>
      <header>
        <h1>{title}</h1>
        <h2>
          {seasons.length} season{seasons.length > 1 ? "s!" : "!"}
        </h2>
        <div>
          <h3>Last updated: {formattedDate}</h3>
          <div className={styles.show_info}>
            <img src={imgSrc} alt="" />
            <div className={styles.descriptions}>
              <p>{description}</p>
              <p className={styles.genres}>{genres}</p>
            </div>
          </div>
          <div className={styles.seasonsContainer}>
            {seasons.map((season) => (
              <button
                key={season.season}
                className={styles.seasonBtn}
                onClick={() => setSelectedSeason(season.season)}
              >
                {season.title}
              </button>
            ))}
            <button
              className={styles.clearBtn}
              onClick={() => setSelectedSeason(null)}
            >
              Clear
            </button>
          </div>
        </div>
      </header>
      <EpisodesDetail
        seasons={seasons}
        selectedSeason={selectedSeason}
        showTitle={title || ""}
      />
      
    </div>
  );
}
