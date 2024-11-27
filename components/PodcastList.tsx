//@ts-check

// PodcastList.tsx
import React from 'react';
import styles from '../styles/Home.module.css';
import {  PodcastListProps } from './interfaces/types'
import { useNavigate } from 'react-router-dom';


export const PodcastList: React.FC<PodcastListProps> = ({
  podcasts,
  favourites,
  toggleFavourite,
  formatDate,
}) => {

  const navigate = useNavigate()

  const handlePodcastClick = (id: string)=>{
    navigate(`/season/${id}`)
  }
  return (
    <ul className={styles.podcastList}>
      {podcasts.map((item) => {
        const isFavourite = favourites.includes(item.id);
        return (
          <li key={item.id}>
            <div className={styles.podcastList_item} onClick={()=> handlePodcastClick(item.id)}>
              <img src={item.image} alt="" className={styles.image} />
              <h2>
                {item.title} |
                <button
                  onClick={() => toggleFavourite(item.id)} // Toggle on click
                  className={`${styles.favBtn} ${isFavourite ? styles.favourite : ''}`}
                >
                  {isFavourite ? "Unfav" : "Fav"} {/* Dynamic button text */}
                </button>
              </h2>
              <p>{item.seasons} season{item.seasons > 1 ? "s" : ""}</p>
              <p>{item.genre}</p>
              <p>{formatDate(item.updated)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};


