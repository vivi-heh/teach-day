import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  RotateCcw,
  Trophy,
  Users,
  Bot,
  Sparkles,
  Volume2,
  Apple,
  Star,
  Terminal,
  Laptop,
  BookOpen,
  PenTool,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playGiftRevealFanfare, playPopClick, playApplause } from '../../utils/audio';

type BoardState = ('X' | 'O' | null)[];
type SymbolTheme = 'apple-star' | 'code-laptop' | 'pencil-book';

export const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<'vsAI' | '2Player'>('vsAI');
  const [difficulty, setDifficulty] = useState<'friendly' | 'smart'>('smart');
  const [symbolTheme, setSymbolTheme] = useState<SymbolTheme>('code-laptop');
  const [scores, setScores] = useState({ p1: 0, p2: 0, ties: 0 });
  const [winnerInfo, setWinnerInfo] = useState<{ winner: 'X' | 'O' | 'Tie' | null; line: number[] | null }>({
    winner: null,
    line: null,
  });

  const getSymbolMeta = (mark: 'X' | 'O') => {
    if (symbolTheme === 'code-laptop') {
      return mark === 'X'
        ? { label: 'Code Terminal', icon: <Terminal className="w-9 h-9 sm:w-12 sm:h-12 text-cyan-600" /> }
        : { label: 'Laptop', icon: <Laptop className="w-9 h-9 sm:w-12 sm:h-12 text-indigo-600" /> };
    }
    if (symbolTheme === 'apple-star') {
      return mark === 'X'
        ? { label: 'Apple', icon: <Apple className="w-9 h-9 sm:w-12 sm:h-12 text-[#E63946] fill-[#E63946]" /> }
        : { label: 'Star', icon: <Star className="w-9 h-9 sm:w-12 sm:h-12 text-amber-500 fill-amber-500" /> };
    }
    return mark === 'X'
      ? { label: 'Pen', icon: <PenTool className="w-9 h-9 sm:w-12 sm:h-12 text-[#2A9D8F]" /> }
      : { label: 'Book', icon: <BookOpen className="w-9 h-9 sm:w-12 sm:h-12 text-amber-600" /> };
  };

  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (currentBoard: BoardState) => {
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a] as 'X' | 'O', line: winningLines[i] };
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return { winner: 'Tie' as const, line: null };
    }
    return { winner: null, line: null };
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winnerInfo.winner) return;

    playPopClick();
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult.winner) {
      handleGameOver(winResult);
      return;
    }

    setIsXNext(!isXNext);
  };

  // AI Turn in vsAI mode
  useEffect(() => {
    if (gameMode === 'vsAI' && !isXNext && !winnerInfo.winner) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, winnerInfo, board]);

  const makeAIMove = () => {
    const emptyIndices: number[] = [];
    board.forEach((val, idx) => {
      if (!val) emptyIndices.push(idx);
    });

    if (emptyIndices.length === 0) return;

    let chosenIndex = emptyIndices[0];

    if (difficulty === 'smart') {
      // Check if AI can win in one move
      for (const idx of emptyIndices) {
        const boardCopy = [...board];
        boardCopy[idx] = 'O';
        if (checkWinner(boardCopy).winner === 'O') {
          chosenIndex = idx;
          applyMove(chosenIndex);
          return;
        }
      }

      // Check if player is about to win and block
      for (const idx of emptyIndices) {
        const boardCopy = [...board];
        boardCopy[idx] = 'X';
        if (checkWinner(boardCopy).winner === 'X') {
          chosenIndex = idx;
          applyMove(chosenIndex);
          return;
        }
      }

      // Center cell priority
      if (emptyIndices.includes(4)) {
        chosenIndex = 4;
      } else {
        chosenIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    } else {
      chosenIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    applyMove(chosenIndex);
  };

  const applyMove = (idx: number) => {
    playPopClick();
    const newBoard = [...board];
    newBoard[idx] = 'O';
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult.winner) {
      handleGameOver(winResult);
    } else {
      setIsXNext(true);
    }
  };

  const handleGameOver = (winResult: { winner: 'X' | 'O' | 'Tie' | null; line: number[] | null }) => {
    setWinnerInfo(winResult);

    if (winResult.winner === 'X') {
      setScores((prev) => ({ ...prev, p1: prev.p1 + 1 }));
      playApplause();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else if (winResult.winner === 'O') {
      setScores((prev) => ({ ...prev, p2: prev.p2 + 1 }));
      playGiftRevealFanfare();
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } else {
      setScores((prev) => ({ ...prev, ties: prev.ties + 1 }));
    }
  };

  const resetGame = () => {
    playPopClick();
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinnerInfo({ winner: null, line: null });
  };

  const teacherPraiseQuotes = [
    '“Success is no accident. It is hard work, perseverance, learning, and most of all, love of what you are doing.”',
    '“A champion is someone who gets up when they can’t.”',
    '“The beautiful thing about learning is that no one can take it away from you.”',
    '“Genius is 1% inspiration and 99% perspiration!”',
  ];

  const p1Meta = getSymbolMeta('X');
  const p2Meta = getSymbolMeta('O');

  return (
    <div className="bg-white neo-border neo-shadow p-6 md:p-8 text-[#121212] max-w-xl mx-auto">
      {/* Title & Mode Switcher */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E63946] text-white text-[10px] font-black uppercase tracking-wider neo-border-2 mb-2 neo-shadow-sm">
          <span>Chalkboard Mini-Game</span>
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight italic text-[#121212] font-sans heading-pop">
          Teacher’s Chalkboard Challenge
        </h3>
        <p className="text-xs text-[#121212]/75 mt-1 font-bold uppercase tracking-wider">
          Challenge the AI Mentor or play with a friend on the chalkboard!
        </p>
      </div>

      {/* Control Strip: Game Mode & Difficulty & Symbols */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F1FAEE] p-3 neo-border-2 mb-6 text-xs neo-shadow-sm">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setGameMode('vsAI');
              resetGame();
            }}
            className={`px-3 py-1.5 font-black uppercase text-[11px] flex items-center gap-1 transition-all cursor-pointer neo-border-2 ${
              gameMode === 'vsAI' ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm' : 'bg-white text-[#121212] hover:bg-stone-50'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#121212]" />
            <span>vs Mentor AI</span>
          </button>
          <button
            onClick={() => {
              setGameMode('2Player');
              resetGame();
            }}
            className={`px-3 py-1.5 font-black uppercase text-[11px] flex items-center gap-1 transition-all cursor-pointer neo-border-2 ${
              gameMode === '2Player' ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm' : 'bg-white text-[#121212] hover:bg-stone-50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#121212]" />
            <span>2-Player</span>
          </button>
        </div>

        {gameMode === 'vsAI' && (
          <div className="flex items-center gap-1 text-[#121212] font-black text-xs uppercase">
            <span>AI:</span>
            <button
              onClick={() => setDifficulty(difficulty === 'smart' ? 'friendly' : 'smart')}
              className="text-[#E63946] underline cursor-pointer uppercase font-black"
            >
              {difficulty}
            </button>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const next: SymbolTheme =
                symbolTheme === 'code-laptop'
                  ? 'apple-star'
                  : symbolTheme === 'apple-star'
                  ? 'pencil-book'
                  : 'code-laptop';
              setSymbolTheme(next);
              resetGame();
            }}
            className="px-2 py-1 bg-white hover:bg-[#E9C46A] neo-border-2 text-[#121212] transition-colors cursor-pointer font-black text-xs"
            title="Switch Token Set"
          >
            {symbolTheme === 'code-laptop' && 'Terminal vs Laptop'}
            {symbolTheme === 'apple-star' && 'Apple vs Star'}
            {symbolTheme === 'pencil-book' && 'Pen vs Book'}
          </button>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-2 text-center mb-6">
        <div className="bg-[#F1FAEE] neo-border-2 p-2.5 neo-shadow-sm">
          <span className="text-[10px] text-[#121212]/70 block font-black uppercase tracking-wider">
            {gameMode === 'vsAI' ? 'You' : 'Player 1'} ({p1Meta.label})
          </span>
          <span className="text-xl font-black text-[#121212] font-sans">{scores.p1}</span>
        </div>
        <div className="bg-[#F1FAEE] neo-border-2 p-2.5 neo-shadow-sm">
          <span className="text-[10px] text-[#121212]/70 block font-black uppercase tracking-wider">Ties</span>
          <span className="text-xl font-black text-[#121212] font-sans">{scores.ties}</span>
        </div>
        <div className="bg-[#F1FAEE] neo-border-2 p-2.5 neo-shadow-sm">
          <span className="text-[10px] text-[#121212]/70 block font-black uppercase tracking-wider">
            {gameMode === 'vsAI' ? 'Mentor AI' : 'Player 2'} ({p2Meta.label})
          </span>
          <span className="text-xl font-black text-[#E63946] font-sans">{scores.p2}</span>
        </div>
      </div>

      {/* Chalkboard Play Area */}
      <div className="relative bg-[#264653] neo-border p-4 sm:p-5 neo-shadow overflow-hidden mb-6 grid-paper-dark">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 relative z-10 max-w-xs mx-auto">
          {board.map((cell, index) => {
            const isWinningCell = winnerInfo.line?.includes(index);
            const cellMeta = cell ? getSymbolMeta(cell) : null;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCellClick(index)}
                disabled={!!cell || !!winnerInfo.winner}
                id={`tictactoe-cell-${index}`}
                className={`h-20 sm:h-24 md:h-26 neo-border flex items-center justify-center font-black transition-all cursor-pointer select-none min-h-[72px] ${
                  isWinningCell
                    ? 'bg-[#E9C46A] ring-4 ring-[#E63946] animate-pulse'
                    : cell
                    ? 'bg-white neo-shadow-sm'
                    : 'bg-[#F1FAEE] hover:bg-white'
                }`}
              >
                {cellMeta && (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 14 }}
                  >
                    {cellMeta.icon}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Winner / Status Announcement */}
      <div className="text-center space-y-3">
        {winnerInfo.winner ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-[#E9C46A] neo-border-2 neo-shadow-sm"
          >
            <div className="font-black uppercase tracking-tight text-[#121212] text-base flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-[#121212]" />
              <span>
                {winnerInfo.winner === 'Tie'
                  ? 'Honorable Draw! Great Minds Think Alike.'
                  : `${getSymbolMeta(winnerInfo.winner).label} Wins the Game!`}
              </span>
            </div>
            <p className="text-xs text-[#121212] italic mt-1 max-w-sm mx-auto font-medium">
              {teacherPraiseQuotes[Math.floor(Math.random() * teacherPraiseQuotes.length)]}
            </p>
          </motion.div>
        ) : (
          <div className="text-xs text-[#121212] font-black uppercase tracking-wider">
            Turn:{' '}
            <span className="bg-[#A8DADC] neo-border-2 px-2 py-0.5 ml-1">
              {isXNext
                ? `${gameMode === 'vsAI' ? 'Your' : 'Player 1'} turn (${p1Meta.label})`
                : `${gameMode === 'vsAI' ? 'Mentor AI is thinking...' : 'Player 2'} (${p2Meta.label})`}
            </span>
          </div>
        )}

        <button
          onClick={resetGame}
          id="btn-tictactoe-reset"
          className="px-5 py-2.5 bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-xs tracking-wider inline-flex items-center gap-2 neo-shadow transition-all cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Round</span>
        </button>
      </div>
    </div>
  );
};

