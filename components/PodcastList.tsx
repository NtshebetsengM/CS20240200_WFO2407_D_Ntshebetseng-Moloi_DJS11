//@ts-check

// PodcastList.tsx
import React from 'react';
import styles from '../styles/Home.module.css';
import {  PodcastListProps } from './interfaces/types'


export const PodcastList: React.FC<PodcastListProps> = ({
  podcasts,
  favourites,
  toggleFavourite,
  formatDate,
}) => {
  return (
    <ul className={styles.podcastList}>
      {podcasts.map((item) => {
        const isFavourite = favourites.includes(item.id);
        return (
          <li key={item.id}>
            <div className={styles.podcastList_item}>
              <img src={item.image} alt="" className={styles.image} />
              <h2>
                {item.title} |
                <button
                  onClick={() => toggleFavourite(item.id)}
                  className={`${styles.favBtn} ${isFavourite ? styles.favourite : ''}`}
                >
                  fav
                </button>
              </h2>
              <p>seasons {item.seasons}</p>
              <p>{item.genre}</p>
              <p>{formatDate(item.updated)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};


