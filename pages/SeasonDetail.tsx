//@ts-check
import { useEffect, useState } from "react";
import { Episode, Season } from "components/interfaces/types";
export function SeasonDetail() {
 const showApiUrl = `https://podcast-api.netlify.app/id/10716/`



 const [ show, setShow ] = useState<string[]>([])
 const [ title, setTitle ] = useState<string>()
 const [ description, setDescription ] = useState<string>('')
 const [ genres, setGenre ] = useState<string[]>([])
 const [ imgSrc, setImgSrc ] = useState<string>('')
 const [ seasons, setSeason] = useState<Season[]>([])
 const [ episode, setEpisode ] = useState<Episode[]>([])
 const [ updated, setUpdated ] = useState<string>('')


 useEffect(() => {
  fetch(showApiUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error("Data fetching failed");
      }
      return res.json();
    })
    .then(data => {
      console.log("data", data)
      
      if(data && data.seasons){
        setShow(data)
        setTitle(data.title);  // Set title state
        setDescription(data.description);  // Set description state
        setGenre(data.genres);  // Set genres state
        setImgSrc(data.image);  // Set image source
        setSeason(data.seasons);  // Set seasons state
        setUpdated(data.updated)
        setEpisode(data.seasons.episodes)
      } else {
        console.error('no seasons data available')
      }
      

    })
    .catch((error) => {
      console.error('failed to fetch data', error)
    });
}, [showApiUrl]);

useEffect(() => {
  if (seasons.length > 0) {
    // Access episodes of the first season, for example
  console.log('show', show)
    console.log('Seasons:', seasons);
    console.log('Episodes in first season:', seasons[0]?.episodes);  // Access episodes for the first season
  }
}, [episode, seasons, show])
  
 return (
  <div>
    <h1>{title}</h1>
    <h2>seasons: {seasons.length} </h2>
    <h3>last updated: {updated}</h3>
    <img src={imgSrc} width="100px" alt="" />
    <p>{genres} | </p>
    <p>{description} | </p>
    <div>
    {seasons.length > 0 && seasons.map((season: Season, index: number) => (
          <div key={index}>
            <h2>{season.title}</h2>
            <div>
              {season.episodes && season.episodes.map((episode: Episode, idx: number) => (
                <div key={idx}>
                  <img src={season.image} width="100px" alt="" />
                  <h3>{episode.title}</h3>
                  <p>{episode.description}</p>
                  
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
    
  </div>
 )

  }
  