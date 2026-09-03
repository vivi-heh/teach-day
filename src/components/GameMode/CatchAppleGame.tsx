import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  RotateCcw,
  Trophy,
  Sparkles,
  Apple,
  BookOpen,
  GraduationCap,
  BellOff,
  Laptop,
  Briefcase,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playGiftRevealFanfare, playPopClick } from '../../utils/audio';

interface FallingItem {
  id: number;
  x: number; // percentage (0 to 90)
  y: number; // percentage (0 to 100)
  speed: number;
  type: 'apple' | 'book' | 'laptop' | 'cap' | 'alarm';
  points: number;
}

export const CatchAppleGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35);
  const [basketX, setBasketX] = useState(50); // percentage
  const [gameOver, setGameOver] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<FallingItem[]>([]);
  const [renderedItems, setRenderedItems] = useState<FallingItem[]>([]);
  const animFrameId = useRef<number | null>(null);
  const lastSpawnTime = useRef<number>(0);

  const itemTypes = [
    { type: 'apple' as const, points: 10, weight: 4 },
    { type: 'book' as const, points: 15, weight: 3 },
    { type: 'laptop' as const, points: 20, weight: 2 },
    { type: 'cap' as const, points: 25, weight: 1 },
    { type: 'alarm' as const, points: -15, weight: 2 },
  ];

  const renderItemIcon = (type: FallingItem['type']) => {
    switch (type) {
      case 'apple':
        return (
          <div className="p-2 bg-rose-500 text-white rounded-full neo-border-2 shadow-sm">
            <Apple className="w-5 h-5 fill-white" />
          </div>
        );
      case 'book':
        return (
          <div className="p-2 bg-amber-500 text-white rounded-md neo-border-2 shadow-sm">
            <BookOpen className="w-5 h-5 fill-white/20" />
          </div>
        );
      case 'laptop':
        return (
          <div className="p-2 bg-cyan-600 text-white rounded-md neo-border-2 shadow-sm">
            <Laptop className="w-5 h-5" />
          </div>
        );
      case 'cap':
        return (
          <div className="p-2 bg-[#264653] text-white rounded-md neo-border-2 shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
        );
      case 'alarm':
        return (
          <div className="p-2 bg-[#E63946] text-white rounded-full neo-border-2 animate-bounce shadow-sm">
            <BellOff className="w-5 h-5" />
          </div>
        );
    }
  };

  const startGame = () => {
    playPopClick();
    setScore(0);
    setTimeLeft(35);
    setGameOver(false);
    setIsPlaying(true);
    itemsRef.current = [];
    setRenderedItems([]);
    lastSpawnTime.current = Date.now();
  };

  // Timer countdown
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    playGiftRevealFanfare();
    confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    setHighScore((prev) => Math.max(prev, score));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketX((x) => Math.max(5, x - 7));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketX((x) => Math.min(92, x + 7));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Pointer / Mouse drag on stage
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPlaying || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(5, Math.min(92, relativeX)));
  };

  // Game loop for falling items
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      return;
    }

    const loop = () => {
      const now = Date.now();

      // Spawn new items every ~650ms
      if (now - lastSpawnTime.current > 650) {
        lastSpawnTime.current = now;
        const pool: typeof itemTypes = [];
        itemTypes.forEach((it) => {
          for (let i = 0; i < it.weight; i++) pool.push(it);
        });
        const chosen = pool[Math.floor(Math.random() * pool.length)];

        itemsRef.current.push({
          id: now + Math.random(),
          x: Math.floor(Math.random() * 85) + 5,
          y: 0,
          speed: Math.random() * 0.7 + 0.6,
          type: chosen.type,
          points: chosen.points,
        });
      }

      // Update positions & check basket collision
      const remaining: FallingItem[] = [];
      const basketHitWidth = 14; // percentage
      const basketYPos = 85;

      for (const item of itemsRef.current) {
        item.y += item.speed;

        // Check if caught by basket near bottom
        if (item.y >= basketYPos - 4 && item.y <= basketYPos + 6) {
          if (Math.abs(item.x - basketX) < basketHitWidth) {
            // Collision caught!
            playPopClick();
            setScore((s) => Math.max(0, s + item.points));
            continue; // Item collected
          }
        }

        // If not fallen off bottom
        if (item.y < 100) {
          remaining.push(item);
        }
      }

      itemsRef.current = remaining;
      setRenderedItems([...remaining]);

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPlaying, basketX]);

  return (
    <div className="bg-white neo-border neo-shadow p-6 md:p-8 text-[#121212] max-w-xl mx-auto">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E63946] text-white text-[10px] font-black uppercase tracking-wider neo-border-2 mb-2 neo-shadow-sm">
          <span>Arcade Mini-Game</span>
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight italic text-[#121212] font-sans heading-pop">
          Catch the Wisdom Badges!
        </h3>
        <p className="text-xs text-[#121212]/75 mt-0.5 font-bold uppercase tracking-wider">
          Catch falling apples, textbooks, and computer devices while dodging distracting alarms!
        </p>
      </div>

      {/* Top scoreboard */}
      <div className="flex items-center justify-between bg-[#F1FAEE] p-3 neo-border-2 mb-4 text-xs font-black uppercase neo-shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-[#121212]/70">Score:</span>
          <span className="text-base font-black text-[#121212] font-sans">{score}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#121212]/70">Time:</span>
          <span className={`text-base font-black font-mono ${timeLeft <= 5 ? 'text-[#E63946] animate-pulse' : 'text-[#121212]'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#121212]/70">High:</span>
          <span className="text-[#264653] font-black font-sans">{highScore}</span>
        </div>
      </div>

      {/* Game Stage */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative h-80 bg-[#F1FAEE] neo-border overflow-hidden select-none cursor-ew-resize touch-none grid-paper neo-shadow"
      >
        {/* Floating Items */}
        {renderedItems.map((item) => (
          <div
            key={item.id}
            className="absolute -translate-x-1/2 pointer-events-none transition-transform"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
          >
            {renderItemIcon(item.type)}
          </div>
        ))}

        {/* Player Basket / Bag */}
        <div
          className="absolute bottom-4 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
          style={{ left: `${basketX}%` }}
        >
          <div className="p-3 bg-[#E9C46A] neo-border-2 text-[#121212] neo-shadow-sm rounded-lg flex items-center gap-1.5">
            <Briefcase className="w-5 h-5 text-[#121212]" />
            <span className="text-[10px] font-black uppercase tracking-tight">Satchel</span>
          </div>
          <div className="w-14 h-2 bg-[#121212]/40 neo-border-2 mt-0.5" />
        </div>

        {/* Idle / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            {gameOver ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-3"
              >
                <div className="w-16 h-16 bg-[#E9C46A] neo-border-2 mx-auto flex items-center justify-center neo-shadow-sm">
                  <Trophy className="w-8 h-8 text-[#121212]" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight italic font-sans text-[#121212] heading-pop">
                  Class Dismissed! Final Score: {score}
                </h4>
                <p className="text-xs text-[#121212]/80 font-medium">
                  {score >= 100
                    ? 'Superb! You gathered an abundance of knowledge and innovation!'
                    : 'Good run! Give it another try for a higher score!'}
                </p>
                <button
                  onClick={startGame}
                  id="btn-catch-replay"
                  className="px-6 py-2.5 bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-xs neo-shadow transition-all cursor-pointer inline-flex items-center gap-1.5 hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-[#E9C46A] neo-border-2 mx-auto flex items-center justify-center neo-shadow-sm">
                  <Apple className="w-8 h-8 text-[#E63946] fill-[#E63946]" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight italic font-sans text-[#121212] heading-pop">
                  Ready to Harvest Wisdom & Code?
                </h4>
                <div className="text-xs text-[#121212] max-w-xs space-y-1.5 font-bold text-left bg-[#F1FAEE] p-3 neo-border-2">
                  <p className="flex items-center gap-1.5 text-emerald-800">
                    <Apple className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Apples (+10) • Books (+15)</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-cyan-800">
                    <Laptop className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Laptops (+20) • Laurels (+25)</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[#E63946]">
                    <BellOff className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>Dodge Alarms (-15 penalty)</span>
                  </p>
                </div>
                <button
                  onClick={startGame}
                  id="btn-catch-start"
                  className="px-7 py-3 bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-xs neo-shadow transition-all cursor-pointer inline-flex items-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Game (35s)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div className="grid grid-cols-2 gap-3 mt-3 sm:hidden">
        <button
          onClick={() => setBasketX((x) => Math.max(5, x - 12))}
          id="btn-catch-left"
          className="py-3 bg-[#F1FAEE] hover:bg-white text-[#121212] font-black uppercase text-xs neo-border-2 neo-shadow-sm flex items-center justify-center gap-2 active:translate-y-[1px] min-h-[48px]"
        >
          <span>◀ Move Left</span>
        </button>
        <button
          onClick={() => setBasketX((x) => Math.min(92, x + 12))}
          id="btn-catch-right"
          className="py-3 bg-[#F1FAEE] hover:bg-white text-[#121212] font-black uppercase text-xs neo-border-2 neo-shadow-sm flex items-center justify-center gap-2 active:translate-y-[1px] min-h-[48px]"
        >
          <span>Move Right ▶</span>
        </button>
      </div>

      {/* Instructions footer */}
      <div className="mt-3 text-center text-[11px] text-[#121212]/80 font-bold uppercase tracking-wider">
        Controls: Drag finger / mouse across stage, use buttons above, or press <kbd className="bg-[#F1FAEE] px-1.5 py-0.5 neo-border-2 text-[#121212]">←</kbd> <kbd className="bg-[#F1FAEE] px-1.5 py-0.5 neo-border-2 text-[#121212]">→</kbd>
      </div>
    </div>
  );
};
