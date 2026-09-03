import React, { useState } from 'react';
import { Gamepad2, Sparkles, Grid3X3, HelpCircle, Apple } from 'lucide-react';
import { TicTacToeGame } from './TicTacToeGame';
import { TeacherTriviaGame } from './TeacherTriviaGame';
import { CatchAppleGame } from './CatchAppleGame';
import { playPopClick } from '../../utils/audio';

export const GameModeHub: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<'tictactoe' | 'trivia' | 'catch'>('tictactoe');

  const games = [
    {
      id: 'tictactoe' as const,
      name: 'Chalkboard Tic-Tac-Toe',
      desc: 'Play with Apples 🍎 vs Stars ⭐ against AI or friends',
      icon: Grid3X3,
      badge: 'Chalkboard Classic',
    },
    {
      id: 'trivia' as const,
      name: 'Educator Trivia & Wisdom',
      desc: 'Test your knowledge on legendary teachers & history',
      icon: HelpCircle,
      badge: 'Brain Challenge',
    },
    {
      id: 'catch' as const,
      name: 'Catch the Wisdom Apples',
      desc: 'Catch falling apples & books in your backpack',
      icon: Apple,
      badge: 'Action Arcade',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <section className="bg-[#264653] neo-border neo-shadow p-6 md:p-8 text-white grid-paper text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E63946] text-white text-[10px] font-black uppercase tracking-wider neo-border-2 mb-2 neo-shadow-sm">
          <Gamepad2 className="w-3.5 h-3.5 text-white" />
          <span>Teachers’ Day Mini-Games Hub</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight italic font-sans text-white">
          Playful Classroom Mini-Games
        </h2>
        <p className="text-xs sm:text-sm text-stone-200 mt-2 font-medium max-w-xl mx-auto">
          Celebrate Teachers’ Day with cheerful learning games, chalkboard competitions, and wisdom puzzles.
        </p>
      </section>

      {/* Mini-Game Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {games.map((g) => {
          const Icon = g.icon;
          const isSelected = selectedGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                playPopClick();
                setSelectedGame(g.id);
              }}
              id={`game-tab-${g.id}`}
              className={`p-4 neo-border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#E9C46A] text-[#121212] neo-shadow scale-[1.02]'
                  : 'bg-white text-[#121212] hover:bg-[#F1FAEE]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 neo-border-2 ${isSelected ? 'bg-white' : 'bg-[#F1FAEE]'}`}>
                    <Icon className="w-5 h-5 text-[#121212]" />
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 neo-border-2 ${isSelected ? 'bg-[#E63946] text-white' : 'bg-[#A8DADC] text-[#121212]'}`}>
                    {g.badge}
                  </span>
                </div>
                <h4 className="font-black uppercase tracking-tight italic text-sm leading-tight text-[#121212]">
                  {g.name}
                </h4>
                <p className="text-xs mt-1 leading-snug font-medium text-[#121212]/80">
                  {g.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Container */}
      <div className="pt-2">
        {selectedGame === 'tictactoe' && <TicTacToeGame />}
        {selectedGame === 'trivia' && <TeacherTriviaGame />}
        {selectedGame === 'catch' && <CatchAppleGame />}
      </div>
    </div>
  );
};
