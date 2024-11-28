import { useEffect, useRef, useState } from "react";


export function useAudioPlayback(initialAudio: { file: string; title: string } | null) {
  const [currentAudio, setCurrentAudio] = useState(initialAudio);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [previousAudios, setPreviousAudios] = useState<{ file: string; title: string; time: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load previous audios from localStorage
  useEffect(() => {
    const storedPreviousAudios = JSON.parse(localStorage.getItem("previousAudios") || "[]");
    setPreviousAudios(storedPreviousAudios);
    console.log("line 16 title", storedPreviousAudios)
  }, []);

  useEffect(() => {
    if (currentAudio) {
      const storedTime = localStorage.getItem(`time-${currentAudio.title}`);
      // If the current audio is different from the previously played one, reset the time to 0
      if (storedTime) {
        setCurrentTime(Number(storedTime)); // Set to stored time
      } else {
        setCurrentTime(0); // Default to 0 if no stored time exists
      }
    }
    console.log("current audio", currentAudio)
    console.log("stored time", currentTime)
  }, [currentAudio, currentTime]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handlePlayPause = () => {
    if (!audioRef.current || !currentAudio) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(prev => !prev);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current || !currentAudio) return;

    const newTime = audioRef.current.currentTime;
    setCurrentTime(newTime);
    localStorage.setItem(`time-${currentAudio.title}`, newTime.toString());
  };

  const updateAudio = (file: string, title: string) => {
    // Save the current audio's time before switching
    if (currentAudio) {
      localStorage.setItem(`time-${currentAudio.title}`, currentTime.toString());
    }

    // Check if the audio already exists in the previous audios list
    const existingAudioIndex = previousAudios.findIndex(audio => audio.title === title);

    const newAudio = { file, title, time: currentTime };

    if (existingAudioIndex !== -1) {
      // If it exists, update its time
      const updatedAudios = [...previousAudios];
      updatedAudios[existingAudioIndex] = newAudio; // Update the existing audio in the array
      setPreviousAudios(updatedAudios);
      localStorage.setItem("previousAudios", JSON.stringify(updatedAudios)); // Save to localStorage immediately
    } else {
      // If it's a new audio, add it to the previous audios list
      const updatedAudios = [...previousAudios, newAudio];
      setPreviousAudios(updatedAudios);
      localStorage.setItem("previousAudios", JSON.stringify(updatedAudios)); // Save to localStorage immediately
    }

    // Set the new current audio and reset the play state
    setCurrentAudio({ file, title });
    setIsPlaying(false); // Stop previous playback
  };

  const resumeAudio = (audio: { file: string; title: string }) => {
    const storedTime = localStorage.getItem(`time-${audio.title}`);
    setCurrentTime(storedTime ? Number(storedTime) : 0);
    setCurrentAudio(audio);
    setIsPlaying(true);
  };

  // Save the previous audios to localStorage whenever the array changes
  useEffect(() => {
    if (previousAudios.length > 0) {
      localStorage.setItem("previousAudios", JSON.stringify(previousAudios));
    }
  }, [previousAudios]);

  return {
    currentAudio,
    isPlaying,
    currentTime,
    audioRef,
    handlePlayPause,
    handleTimeUpdate,
    updateAudio,
    resumeAudio,
    previousAudios,
  };
}
