import styles from "../styles/AudioPlayer.module.css";
//@ts-check
interface AudioPlayerProps {
  currentAudio: { file: string; title: string } | null;
  audioRef: React.RefObject<HTMLAudioElement>;
  handleTimeUpdate: () => void;
  onClose: () => void; // New prop for closing the player
}

export const AudioPlayer = ({
  currentAudio,
  audioRef,
  handleTimeUpdate,
  onClose,
}: AudioPlayerProps) => {
  if (!currentAudio) return null;

  return (
    <div className={styles.audioControls}>
      <h3>Now Playing: {currentAudio.title}</h3>
      <audio
        ref={audioRef}
        src={currentAudio.file}
        onTimeUpdate={handleTimeUpdate}
        controls
      />
      <button onClick={onClose} className={styles.closeBtn}>Close</button> {/* Trigger the onClose prop */}
    </div>
  );
};
