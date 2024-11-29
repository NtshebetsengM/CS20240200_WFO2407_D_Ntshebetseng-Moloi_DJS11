//@ts-check

// PodcastList.tsx
import React from 'react';
import styles from '../styles/Home.module.css';
import {  PodcastListProps } from './interfaces/types'
import { useNavigate } from 'react-router-dom';


export const PodcastList: React.FC<PodcastListProps> = ({
  podcasts,
  formatDate,
}) => {

  const navigate = useNavigate()

  const handlePodcastClick = (id: string)=>{
    navigate(`/season/${id}`)
  }
  return (
    <ul className={styles.podcastList}>
      {podcasts.map((item) => {
        return (
          <li key={item.id}>
            <div className={styles.podcastList_item} >
              <img src={item.image} alt="" className={styles.image} onClick={()=> handlePodcastClick(item.id)} />
              <h2>
                {item.title} 
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


