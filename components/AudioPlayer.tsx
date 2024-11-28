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
  if (!currentAudio) return null;

  return (
    <div className={styles.audioControls} >
      <h3>Now Playing: {currentAudio.title}</h3>
      <audio
        ref={audioRef}
        src={currentAudio.file}
        onTimeUpdate={handleTimeUpdate}
        controls
      />
      <button onClick={handlePlayPause}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};
