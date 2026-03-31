import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-black border-4 border-cyan-500 relative w-full max-w-[500px]">
      <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-fuchsia-500"></div>
      <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-fuchsia-500"></div>

      <div className="flex justify-between w-full items-center border-b-2 border-fuchsia-500 pb-4">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-mono text-fuchsia-500">DATA.FRAGMENTS:</span>
          <span className="text-4xl font-mono font-bold text-cyan-400 glitch-text" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-4 py-2 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors text-xl font-mono uppercase"
        >
          {isPaused ? 'RESUME' : 'HALT'}
        </button>
      </div>

      <div 
        className="relative bg-black border-2 border-fuchsia-500/50 w-full aspect-square"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[1px] border-cyan-900" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`${
              i === 0 ? 'bg-cyan-400 z-10' : 'bg-cyan-700'
            } border border-black`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="bg-fuchsia-500 animate-pulse border border-black"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-6 z-20 border-4 border-fuchsia-500">
            <h2 className="text-5xl font-mono text-fuchsia-500 glitch-text" data-text="SYSTEM.FAILURE">
              SYSTEM.FAILURE
            </h2>
            <p className="text-cyan-400 text-2xl">FRAGMENTS RECOVERED: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-transparent border-2 border-cyan-500 text-cyan-400 text-2xl hover:bg-cyan-500 hover:text-black transition-colors uppercase"
            >
              REBOOT.SEQUENCE
            </button>
          </div>
        )}

        {/* Start Overlay */}
        {isPaused && !isGameOver && score === 0 && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-6 z-20">
            <button
              onClick={() => setIsPaused(false)}
              className="px-8 py-4 bg-cyan-500 text-black text-3xl font-bold hover:bg-fuchsia-500 transition-colors uppercase border-4 border-black outline outline-2 outline-cyan-500"
            >
              EXECUTE
            </button>
            <p className="text-fuchsia-500 text-xl animate-pulse">AWAITING COMMAND...</p>
          </div>
        )}
      </div>

      <div className="w-full flex justify-between text-lg text-cyan-600 border-t-2 border-fuchsia-500 pt-4">
        <span>&gt; INPUT: ARROWS</span>
        <span>&gt; INTERRUPT: SPACE</span>
      </div>
    </div>
  );
}
