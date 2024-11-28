//@ts-check

import { useEffect, useRef, useState } from "react";

export function useAudioPlayback(initialAudio: { file: string; title: string } | null) {
  const [currentAudio, setCurrentAudio] = useState(initialAudio);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentAudio) {
      const storedTime = localStorage.getItem(`time-${currentAudio.title}`);
      setCurrentTime(storedTime ? Number(storedTime) : 0);
    }
  }, [currentAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current || !currentAudio) return;
    const newTime = audioRef.current.currentTime;
    setCurrentTime(newTime);
    localStorage.setItem(`time-${currentAudio.title}`, newTime.toString());
  };

  const updateAudio = (file: string, title: string) => {
    setCurrentAudio({ file, title });
    localStorage.setItem("currentAudio", JSON.stringify({ file, title }));
    setIsPlaying(false); // Stop previous playback
  };

  return {
    currentAudio,
    isPlaying,
    currentTime,
    audioRef,
    handlePlayPause,
    handleTimeUpdate,
    updateAudio,
  };
}
