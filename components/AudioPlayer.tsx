import { useEffect } from "react";
import styles from "../styles/AudioPlayer.module.css"
//@ts-check
interface AudioPlayerProps {
  currentAudio: { file: string; title: string } | null;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  handlePlayPause: () => void;
  handleTimeUpdate: () => void;
}

export const AudioPlayer = ({
  currentAudio,
  isPlaying,
  audioRef,
  handlePlayPause,
  handleTimeUpdate,
}: AudioPlayerProps) => {

useEffect(()=>{
  if (audioRef.current && currentAudio){
    audioRef.current.load()
  }
},[currentAudio, audioRef])

useEffect(()=>{
  if (audioRef.current && isPlaying){
    audioRef.current.play()
  } else if (audioRef.current && !isPlaying){
    audioRef.current.pause()
  }
},[isPlaying, audioRef])

  if (!currentAudio) return null;

console.log("we up", currentAudio.file)

  return (
    <div className={styles.audioControls} >
        <h3>Now Playing: {currentAudio.title}</h3>
        <audio
          ref={audioRef}
          src={currentAudio.file}
          onTimeUpdate={handleTimeUpdate}
          
        />
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button className={styles.closeBtn} >close</button>
    </div>
  );
};
