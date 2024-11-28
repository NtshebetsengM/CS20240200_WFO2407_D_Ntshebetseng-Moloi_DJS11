
import styles from "../styles/AudioPlayer.module.css"
//@ts-check
interface AudioPlayerProps {
  currentAudio: { file: string; title: string } | null;
  audioRef: React.RefObject<HTMLAudioElement>;
  handleTimeUpdate: () => void;
}

export const AudioPlayer = ({currentAudio, audioRef,handleTimeUpdate}:AudioPlayerProps)=>{
  if(!currentAudio) return null


  return (
    <div className={styles.audioControls} >
        <h3>Now Playing: {currentAudio.title}</h3>
        <audio
          ref={audioRef}
          src={currentAudio.file}
          onTimeUpdate={handleTimeUpdate}
          controls
        />
       
        <button className={styles.closeBtn} >close</button>
    </div>
  );
};
