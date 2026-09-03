import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRIVIA_QUESTIONS } from '../../data/mockData';
import { playPopClick, playGiftRevealFanfare, playApplause } from '../../utils/audio';

export const TeacherTriviaGame: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = TRIVIA_QUESTIONS[currentIdx];

  const handleSelectOption = (index: number) => {
    if (selectedAnswer !== null) return;
    playPopClick();
    setSelectedAnswer(index);

    if (index === currentQ.correctIndex) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      playApplause();
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    playPopClick();
    if (currentIdx + 1 < TRIVIA_QUESTIONS.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      setIsCompleted(true);
      playGiftRevealFanfare();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    playPopClick();
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
  };

  return (
    <div className="bg-white neo-border neo-shadow p-6 md:p-8 text-[#121212] max-w-xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E63946] text-white text-[10px] font-black uppercase tracking-wider neo-border-2 mb-2 neo-shadow-sm">
          <span>Wisdom & History Quiz</span>
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight italic text-[#121212] font-sans">
          Educators’ Hall of Fame Trivia
        </h3>
        <p className="text-xs text-[#121212]/75 mt-1 font-bold uppercase tracking-wider">
          Test your knowledge of legendary mentors, history of Teachers’ Day, and inspiring pedagogical facts!
        </p>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Progress & Stats header */}
          <div className="flex items-center justify-between text-xs bg-[#F1FAEE] px-4 py-2.5 neo-border-2 neo-shadow-sm">
            <span className="font-black uppercase text-[#121212]">
              Question {currentIdx + 1} of {TRIVIA_QUESTIONS.length}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-[#E63946] font-black uppercase">
                Streak: {streak} 🔥
              </span>
              <span className="text-[#264653] font-black uppercase">
                Score: {score} / {TRIVIA_QUESTIONS.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#F1FAEE] h-3 neo-border-2 overflow-hidden">
            <div
              className="bg-[#E63946] h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / TRIVIA_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="bg-[#F1FAEE] neo-border-2 p-5 neo-shadow-sm">
            <h4 className="font-black uppercase tracking-tight italic text-base sm:text-lg text-[#121212] leading-snug">
              {currentQ.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = 'bg-white neo-border-2 hover:bg-[#E9C46A] text-[#121212]';

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-[#A8DADC] neo-border-2 text-[#121212] font-black';
                } else if (isSelected) {
                  btnStyle = 'bg-[#E63946] neo-border-2 text-white font-black';
                } else {
                  btnStyle = 'bg-[#F1FAEE] neo-border-2 opacity-50 text-[#121212]';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedAnswer !== null}
                  id={`trivia-opt-${idx}`}
                  className={`w-full p-3.5 neo-border-2 text-left text-xs sm:text-sm font-bold transition-all flex items-start justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span>{option}</span>
                  {selectedAnswer !== null && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-[#121212] shrink-0 mt-0.5" />
                  )}
                  {selectedAnswer !== null && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Breakdown & Fun Fact */}
          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#E9C46A] neo-border-2 p-4 text-xs space-y-2 text-[#121212] neo-shadow-sm"
            >
              <div className="flex items-center gap-1.5 font-black uppercase text-[#121212]">
                <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
                <span>Historical Fact:</span>
              </div>
              <p className="text-[#121212] leading-relaxed font-medium">
                {currentQ.funFact}
              </p>
              <p className="text-[#121212] italic font-bold pt-1 border-t-2 border-[#121212]">
                💡 Lesson: {currentQ.teacherWisdom}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  id="btn-trivia-next"
                  className="px-4 py-2 bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-xs neo-shadow transition-all flex items-center gap-1.5 cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  <span>{currentIdx + 1 < TRIVIA_QUESTIONS.length ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* Completion Certificate View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6 space-y-6"
        >
          <div className="w-20 h-20 neo-border bg-[#E9C46A] text-[#121212] mx-auto flex items-center justify-center text-4xl neo-shadow">
            🏆
          </div>

          <div>
            <span className="text-xs uppercase font-black tracking-widest text-[#E63946]">
              Quiz Completed!
            </span>
            <h4 className="text-2xl font-black uppercase tracking-tight italic font-sans text-[#121212] mt-1">
              You scored {score} / {TRIVIA_QUESTIONS.length}
            </h4>
            <p className="text-xs text-[#121212]/80 max-w-sm mx-auto mt-2 font-medium">
              {score >= 4
                ? 'Outstanding! You possess the wisdom and knowledge of a master educator.'
                : 'Great effort! Every mistake in learning is just another lesson learned.'}
            </p>
          </div>

          <div className="bg-[#F1FAEE] neo-border-2 p-4 text-xs max-w-sm mx-auto text-[#121212] neo-shadow-sm">
            <span className="font-serif italic font-bold text-[#121212]">
              “Education is not the filling of a pail, but the lighting of a fire.”
            </span>
            <span className="block text-[#E63946] font-black uppercase text-[10px] mt-1">— William Butler Yeats</span>
          </div>

          <button
            onClick={handleRestart}
            id="btn-trivia-restart"
            className="px-6 py-2.5 bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-xs neo-shadow transition-all cursor-pointer flex items-center gap-2 mx-auto hover:translate-x-[1px] hover:translate-y-[1px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Quiz Again</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
