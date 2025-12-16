"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MusicPlayerProps {
  musicFile?: string;
}

export const MusicPlayer = ({ musicFile }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Default to christmas.mp3 if no env var is set
  const audioSrc = musicFile || '/music/christmas.mp3';

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (!hasInteracted) {
      setHasInteracted(true);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked - that's ok
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlay}
        className={`h-8 w-8 p-0 ${isPlaying ? 'text-green-400 hover:text-green-300' : 'text-white/60 hover:text-white'} hover:bg-white/10`}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        <Music className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
      </Button>
      
      {isPlaying && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
};
