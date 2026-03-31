import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_01: SYNTH_CORRUPTION",
    artist: "AI_CONSTRUCT_ALPHA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "ERR_02: DATA_BLEED",
    artist: "GHOST_IN_THE_MACHINE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "ERR_03: NEURAL_STATIC",
    artist: "SYSTEM_OVERRIDE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log("Playback blocked", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSkipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handleSkipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  return (
    <div className="w-full bg-black border-2 border-cyan-500 p-6 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500 animate-pulse"></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSkipForward}
      />

      <div className="mb-6 border-b-2 border-cyan-500/30 pb-4">
        <h2 className="text-2xl font-mono text-fuchsia-500 mb-2">&gt; AUDIO.STREAM</h2>
        <div className="bg-cyan-900/20 border border-cyan-500 p-4">
          <h3 className="text-2xl font-bold text-cyan-400 truncate mb-1 glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-fuchsia-400 text-lg tracking-widest">
            SRC: {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xl font-mono text-cyan-600">
            <span>T-{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>T-{formatTime(duration)}</span>
          </div>
          <div className="relative w-full h-6 border-2 border-cyan-500 bg-black">
            <div 
              className="absolute top-0 left-0 h-full bg-fuchsia-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
            <input
              type="range"
              value={progress}
              onChange={handleProgressChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={handleSkipBack}
            className="flex-1 py-3 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors text-xl font-mono"
          >
            &lt;&lt; PRV
          </button>

          <button
            onClick={togglePlay}
            className="flex-[2] py-3 bg-fuchsia-500 text-black text-2xl font-bold hover:bg-cyan-400 transition-colors border-2 border-transparent hover:border-white"
          >
            {isPlaying ? 'PAUSE.EXE' : 'PLAY.EXE'}
          </button>

          <button 
            onClick={handleSkipForward}
            className="flex-1 py-3 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors text-xl font-mono"
          >
            NXT &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}
