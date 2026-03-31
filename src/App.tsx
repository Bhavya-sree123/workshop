import React, { useEffect, useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [bootSequence, setBootSequence] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBootSequence(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (bootSequence) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center crt-flicker">
        <div className="crt-overlay"></div>
        <div className="scanline"></div>
        <h1 className="text-4xl md:text-6xl font-mono glitch-text" data-text="SYSTEM.BOOT">SYSTEM.BOOT</h1>
        <p className="mt-4 text-fuchsia-500 animate-pulse text-2xl">INITIALIZING NEURAL LINK...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-sans selection:bg-fuchsia-500/50 overflow-x-hidden crt-flicker">
      <div className="crt-overlay"></div>
      <div className="scanline"></div>

      <header className="relative z-10 pt-8 pb-4 px-8 border-b-4 border-fuchsia-500 flex justify-between items-end">
        <div>
          <h1 className="text-5xl md:text-7xl font-mono glitch-text tracking-tighter" data-text="NEON.SNAKE">
            NEON.SNAKE
          </h1>
          <p className="text-fuchsia-500 text-2xl tracking-widest mt-2">v.2.0.26 // GLITCH_ART_PROTOCOL</p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-cyan-400 text-3xl animate-pulse">SYS.ONLINE</div>
          <div className="text-fuchsia-500 text-2xl">MEM: 0x00F4C</div>
        </div>
      </header>

      <main className="relative z-10 p-8 flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start max-w-[1600px] mx-auto">
        
        {/* Left Column: Logs */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 border-2 border-cyan-500 p-4 bg-black/80 h-[600px] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500"></div>
          <h2 className="text-3xl font-mono text-fuchsia-500 border-b-2 border-cyan-500/50 pb-2 mb-2">TERMINAL.LOG</h2>
          <div className="flex flex-col gap-2 text-2xl text-cyan-400/80">
            <p>&gt; ESTABLISHING CONNECTION...</p>
            <p>&gt; CONNECTION SECURED.</p>
            <p>&gt; LOADING AUDIO.FEED...</p>
            <p className="text-fuchsia-400">&gt; WARNING: ANOMALY DETECTED.</p>
            <p>&gt; INITIATING GRID.PROTOCOL...</p>
            <p className="animate-pulse">&gt; AWAITING USER INPUT_</p>
          </div>
        </div>

        {/* Center Column: Snake Game */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <SnakeGame />
        </div>

        {/* Right Column: Music Player */}
        <div className="lg:col-span-3 w-full flex flex-col gap-8">
          <MusicPlayer />
          
          <div className="border-2 border-fuchsia-500 p-4 bg-black/80 relative">
            <div className="absolute top-0 right-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
            <h2 className="text-3xl font-mono text-cyan-400 border-b-2 border-fuchsia-500/50 pb-2 mb-4">SYS.DIAGNOSTICS</h2>
            <div className="space-y-4 text-2xl">
              <div className="flex justify-between items-center">
                <span className="text-fuchsia-500">CPU.LOAD</span>
                <span className="text-cyan-400">89%</span>
              </div>
              <div className="w-full h-6 border-2 border-cyan-500 p-0.5">
                <div className="w-[89%] h-full bg-fuchsia-500"></div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-fuchsia-500">NET.LATENCY</span>
                <span className="text-cyan-400">12ms</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
