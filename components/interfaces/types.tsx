export interface Podcast {
    id: string;
    title: string;
    description: string;
    seasons: number;
    image: string;
    genres: number[];
    updated: string;
    genre: string;
  }
  
  export interface PodcastListProps {
    podcasts: Podcast[];
    favourites: string[];
    toggleFavourite: (id: string) => void;
    formatDate: (dateString: string) => string;
  } 

  export interface Episode{
    title:string;
    description: string;
    episode: number;
    file: string;
  }

  export interface Season {
    season: number;
    title: string;
    image: string;
    episodes: Episode[]
  }