import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  X,
  BookOpen,
  ArrowRight,
  MessageSquareHeart,
  Gamepad2,
  Home,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playGiftRevealFanfare, playSparkleChime, playPopClick } from '../utils/audio';

interface HappyTeachersDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: 'dashboard' | 'cards' | 'games' | 'memories') => void;
}

export const HappyTeachersDayModal: React.FC<HappyTeachersDayModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  // Auto trigger celebratory fanfare and confetti on mount
  useEffect(() => {
    if (!isOpen) return;

    // Trigger celebratory audio
    playGiftRevealFanfare();

    // Fire festive confetti showers
    const fireFestiveConfetti = () => {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#E63946', '#E9C46A', '#2A9D8F', '#F4A261', '#264653', '#FFFFFF'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0.05, y: 0.5 },
          colors: ['#E9C46A', '#E63946', '#2A9D8F'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 0.95, y: 0.5 },
          colors: ['#E9C46A', '#E63946', '#2A9D8F'],
        });
      }, 350);
    };

    fireFestiveConfetti();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfettiBlast = () => {
    playSparkleChime();
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#E63946', '#E9C46A', '#A8DADC', '#F4A261', '#10B981'],
    });
  };

  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
    } else {
      const speechText =
        "Happy Teachers' Day 2026! To every educator, mentor, and guide: whether you teach mathematics, literature, science, arts, languages, or early childhood lessons — today we celebrate YOU! Thank you for your infinite patience, your tireless dedication, and for lighting the path forward for generations. We honor you with deep gratitude.";
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onend = () => setIsPlayingSpeech(false);
      utterance.onerror = () => setIsPlayingSpeech(false);

      setIsPlayingSpeech(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEnterPortal = () => {
    playPopClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSpeech(false);
    onClose();
  };

  const handleJumpTo = (tab: 'dashboard' | 'cards' | 'games' | 'memories') => {
    playPopClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSpeech(false);
    onClose();
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative w-full max-w-2xl bg-[#FDFCFB] neo-border neo-shadow-lg text-[#121212] overflow-hidden my-auto select-none"
        >
          {/* Top celebratory ribbon bar */}
          <div className="bg-[#E63946] text-white px-4 py-2 flex items-center justify-between border-b-2 border-[#121212]">
            <div className="flex items-center gap-2">
              <span className="text-base animate-bounce">🍎</span>
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest">
                ★ TEACHERS’ DAY 2026 TRIBUTE ★
              </span>
            </div>

            <button
              onClick={handleEnterPortal}
              id="btn-close-happy-teachers-intro"
              className="p-1 hover:bg-white hover:text-[#121212] text-white neo-border-2 transition-colors cursor-pointer"
              title="Enter Portal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Festive Background Pattern */}
          <div className="p-6 sm:p-8 space-y-6 relative grid-paper">
            {/* Pop-out Mascot & Floating Badge */}
            <div className="flex flex-col items-center text-center space-y-3">
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-[#E9C46A] neo-border neo-shadow flex items-center justify-center text-4xl sm:text-5xl"
              >
                🎓
              </motion.div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A8DADC] neo-border-2 text-[#121212] text-xs font-black uppercase tracking-wider neo-shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
                <span>Honoring Every Guide, Mentor & Educator</span>
              </div>

              {/* Grand Joyous Headline */}
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight italic font-sans text-[#121212] leading-none">
                HAPPY <span className="text-[#E63946]">TEACHERS’</span> DAY 2026!
              </h1>

              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#121212]">
                To the quiet architects of the future who shape our world
              </p>
            </div>

            {/* Deep Heartfelt Tribute Text - 100% visible, dark text, clean contrast */}
            <div className="bg-[#F1FAEE] neo-border-2 p-5 sm:p-6 neo-shadow-sm space-y-3">
              <p className="text-sm sm:text-base text-[#121212] leading-relaxed font-sans font-normal text-center">
                “Teaching is the singular profession that creates all other professions. Behind every dream we dare to pursue, every doubt we overcome, and every quiet milestone we reach stands an educator whose patience never wavered, whose encouragement carried us forward, and whose belief opened doors we never knew existed.”
              </p>
              <div className="pt-2 border-t-2 border-[#121212]/15 flex items-center justify-between text-xs font-black uppercase text-[#121212]">
                <span className="text-[#E63946]">Teachers’ Day 2026</span>
                <span>— From Every Grateful Student</span>
              </div>
            </div>

            {/* 3 Pillar Tribute Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white neo-border-2 p-3 text-center neo-shadow-sm">
                <span className="text-2xl block mb-1">🌟</span>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#121212]">
                  Curiosity Ignited
                </h4>
                <p className="text-xs text-[#121212] mt-1 font-medium leading-normal">
                  For turning difficult lessons into thrilling discoveries.
                </p>
              </div>

              <div className="bg-white neo-border-2 p-3 text-center neo-shadow-sm">
                <span className="text-2xl block mb-1">❤️</span>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#121212]">
                  Infinite Patience
                </h4>
                <p className="text-xs text-[#121212] mt-1 font-medium leading-normal">
                  For gentle reassurance and celebrating every small breakthrough.
                </p>
              </div>

              <div className="bg-white neo-border-2 p-3 text-center neo-shadow-sm">
                <span className="text-2xl block mb-1">🚀</span>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#121212]">
                  Faith in Potential
                </h4>
                <p className="text-xs text-[#121212] mt-1 font-medium leading-normal">
                  For believing in our wings long before we dared to soar.
                </p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleEnterPortal}
                id="btn-enter-portal-primary"
                className="w-full py-3.5 bg-[#E63946] hover:bg-[#d62839] text-white font-black uppercase text-sm sm:text-base tracking-wider neo-border neo-shadow hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>🎉 View Universal Tribute & Wishes</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleConfettiBlast}
                  id="btn-intro-confetti"
                  className="px-4 py-2 bg-[#E9C46A] hover:bg-yellow-300 text-[#121212] neo-border-2 text-xs font-black uppercase tracking-wider neo-shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>Shower Confetti 🎊</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleVoice}
                  id="btn-intro-audio-tribute"
                  className={`px-4 py-2 neo-border-2 text-xs font-black uppercase tracking-wider neo-shadow-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                    isPlayingSpeech
                      ? 'bg-[#264653] text-white animate-pulse'
                      : 'bg-white hover:bg-[#F1FAEE] text-[#121212]'
                  }`}
                >
                  {isPlayingSpeech ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Stop Narration</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#E63946]" />
                      <span>Listen to Dedication 🔊</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Jumps */}
            <div className="pt-3 border-t-2 border-[#121212]/15 text-center">
              <span className="text-xs font-black uppercase text-[#121212] tracking-wider block mb-2">
                Jump directly to celebration areas:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-black uppercase">
                <button
                  onClick={() => handleJumpTo('dashboard')}
                  className="px-3 py-1.5 bg-[#FFF3B0] hover:bg-yellow-200 neo-border-2 text-[#121212] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Home className="w-3.5 h-3.5" /> 🌟 Tribute Home
                </button>
                <button
                  onClick={() => handleJumpTo('cards')}
                  className="px-3 py-1.5 bg-[#A8DADC] hover:bg-teal-200 neo-border-2 text-[#121212] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" /> 💌 Wishes & Cards
                </button>
                <button
                  onClick={() => handleJumpTo('memories')}
                  className="px-3 py-1.5 bg-[#FFD166] hover:bg-amber-300 neo-border-2 text-[#121212] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <MessageSquareHeart className="w-3.5 h-3.5" /> 💬 Gratitude Notes
                </button>
                <button
                  onClick={() => handleJumpTo('games')}
                  className="px-3 py-1.5 bg-[#F4A261] hover:bg-orange-300 neo-border-2 text-[#121212] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Gamepad2 className="w-3.5 h-3.5" /> 🎮 Trivia & Games
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
