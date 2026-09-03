import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Award, Gift, Heart, Printer, Volume2, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Teacher } from '../../types';
import { playGiftRevealFanfare, playSparkleChime, playPopClick } from '../../utils/audio';

interface GiftSurpriseModalProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
  onGiftUnlocked: (teacherId: string) => void;
}

export const GiftSurpriseModal: React.FC<GiftSurpriseModalProps> = ({
  teacher,
  isOpen,
  onClose,
  onGiftUnlocked,
}) => {
  // Stages: 'ready' (wrapped box) -> 'unwrapping' (shaking & ribbon opening) -> 'revealed' (certificate & tribute)
  const [stage, setStage] = useState<'ready' | 'unwrapping' | 'revealed'>('ready');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (teacher.gift.giftUnlocked) {
        setStage('revealed');
      } else {
        setStage('ready');
      }
    }
  }, [isOpen, teacher]);

  if (!isOpen) return null;

  const handleUnwrap = () => {
    playSparkleChime();
    setStage('unwrapping');

    // After 1.4s of box shake and ribbon unravel, reveal the gift
    setTimeout(() => {
      setStage('revealed');
      onGiftUnlocked(teacher.id);
      playGiftRevealFanfare();

      // Trigger spectacular multi-stage confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#f59e0b', '#ec4899', '#3b82f6', '#10b981'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.6 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.6 },
        });
      }, 300);
    }, 1400);
  };

  const handleReplay = () => {
    playPopClick();
    setStage('ready');
  };

  const handleSpeakTribute = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      return;
    }

    const text = `A tribute to ${teacher.name}, ${teacher.title}. ${teacher.gift.revealQuote}. ${teacher.gift.studentMessage}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingVoice(true);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-[#FDFCFB] text-[#121212] neo-border neo-shadow-lg overflow-hidden my-8"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b-[3px] border-[#121212] bg-[#F1FAEE]">
          <div className="flex items-center gap-2">
            <span className="neo-border-2 bg-[#E9C46A] p-1 text-sm">🎁</span>
            <span className="font-black uppercase tracking-tight text-[#121212] text-base italic">
              Surprise Tribute Box // {teacher.name}
            </span>
          </div>
          <button
            onClick={() => {
              if (isPlayingVoice && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            id="btn-close-gift-modal"
            className="p-1.5 text-[#121212] hover:bg-white neo-border-2 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {stage === 'ready' && (
              <motion.div
                key="box-ready"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center text-center py-6"
              >
                <div className="relative mb-8 cursor-pointer group" onClick={handleUnwrap}>
                  {/* 3D Animated Wrapped Gift Box */}
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, -1.5, 1.5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative w-48 h-48 bg-[#E63946] neo-border neo-shadow-lg flex items-center justify-center transform group-hover:scale-105 transition-transform"
                  >
                    {/* Golden Ribbon Vertical */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-[#E9C46A] border-x-2 border-[#121212]" />
                    {/* Golden Ribbon Horizontal */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-[#E9C46A] border-y-2 border-[#121212]" />

                    {/* Ribbon Bow on top */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#E9C46A] neo-border flex items-center justify-center text-[#121212] font-black text-2xl neo-shadow-sm"
                    >
                      🎀
                    </motion.div>

                    {/* Shimmer sparkle badge */}
                    <div className="z-10 bg-white px-3 py-1 neo-border-2 text-xs font-black uppercase tracking-wider text-[#121212] flex items-center gap-1 neo-shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
                      <span>TAP TO UNWRAP</span>
                    </div>
                  </motion.div>
                </div>

                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight italic text-[#121212] mb-2 font-sans">
                  A Special Dedication Box for {teacher.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#121212]/80 max-w-md mx-auto mb-6 font-medium leading-relaxed">
                  Packed with heartfelt gratitude, student testimonies, and an honorary Teachers’ Day tribute certificate.
                </p>

                <button
                  id="btn-unwrap-gift"
                  onClick={handleUnwrap}
                  className="px-8 py-3.5 bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-sm tracking-wider neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-[#E9C46A]" />
                  <span>Unwrap Surprise Gift</span>
                </button>
              </motion.div>
            )}

            {stage === 'unwrapping' && (
              <motion.div
                key="box-unwrapping"
                className="flex flex-col items-center text-center py-12"
              >
                {/* Energetic Shaking Gift Box */}
                <motion.div
                  animate={{
                    x: [-6, 6, -8, 8, -4, 4, 0],
                    rotate: [-3, 3, -4, 4, -2, 2, 0],
                    scale: [1, 1.06, 0.98, 1.1, 1.02, 1.15],
                  }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-44 h-44 bg-[#F4A261] neo-border neo-shadow-lg flex items-center justify-center"
                >
                  <span className="text-5xl animate-bounce">✨</span>
                </motion.div>

                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="mt-8 text-[#E63946] font-black uppercase tracking-wider text-base"
                >
                  Untying the Golden Ribbon of Gratitude...
                </motion.p>
              </motion.div>
            )}

            {stage === 'revealed' && (
              <motion.div
                key="box-revealed"
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="space-y-6"
              >
                {/* Certificate / Plaque Display Card */}
                <div className="relative bg-[#F1FAEE] neo-border neo-shadow p-6 md:p-8 overflow-hidden print:border-[#121212]">
                  {/* Decorative geometric certificate corners */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-[3px] border-l-[3px] border-[#121212]" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-[3px] border-r-[3px] border-[#121212]" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-[3px] border-l-[3px] border-[#121212]" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-[3px] border-r-[3px] border-[#121212]" />

                  {/* Header Crest */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 neo-border bg-[#E9C46A] text-[#121212] text-3xl neo-shadow-sm mb-3">
                      {teacher.gift.virtualTrophy || '🏆'}
                    </div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-[#E63946] mb-1">
                      Certificate of Everlasting Inspiration
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic text-[#121212]">
                      {teacher.gift.giftTitle}
                    </h2>
                    <p className="text-xs text-[#121212]/70 font-bold uppercase tracking-wider mt-1">Conferred on National & World Teachers’ Day</p>
                  </div>

                  {/* Honoree Info */}
                  <div className="bg-white neo-border-2 p-4 text-center mb-5 neo-shadow-sm">
                    <span className="text-[10px] text-[#121212]/60 uppercase font-black tracking-wider block">Presented with Deepest Respect to</span>
                    <span className="text-xl md:text-2xl font-black uppercase tracking-tight italic text-[#121212] block mt-1">
                      {teacher.name}
                    </span>
                    <span className="text-xs text-[#E63946] font-black uppercase block mt-0.5">
                      {teacher.title} • {teacher.department}
                    </span>
                  </div>

                  {/* Inspirational Quote Tribute */}
                  <div className="relative pl-4 border-l-4 border-l-[#E63946] italic text-[#121212] text-sm md:text-base my-4 font-serif">
                    “{teacher.gift.revealQuote}”
                  </div>

                  {/* Personal Student Letter Message */}
                  <div className="bg-white neo-border-2 p-4 text-[#121212] text-sm leading-relaxed mb-6 neo-shadow-sm">
                    <p className="font-serif italic">{teacher.gift.studentMessage}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#E63946] font-black uppercase tracking-wider">
                      <span>— Signed with love by all your students</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-[#E63946] text-[#E63946]" /> Forever grateful
                      </span>
                    </div>
                  </div>

                  {/* Badges Earned */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t-2 border-[#121212]/15">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#A8DADC] neo-border-2 text-[#121212] text-[10px] font-black uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5 text-[#121212]" />
                      {teacher.gift.badgeName}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4A261] neo-border-2 text-[#121212] text-[10px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-[#121212]" />
                      {teacher.experienceYears}+ Years of Inspiring Lives
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E9C46A] neo-border-2 text-[#121212] text-[10px] font-black uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#121212]" />
                      Hall of Fame Mentor
                    </span>
                  </div>
                </div>

                {/* Modal Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleReplay}
                    id="btn-replay-unbox"
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F1FAEE] hover:bg-white text-[#121212] text-xs font-black uppercase tracking-wider neo-border-2 neo-shadow-sm transition-all cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay Unwrap</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSpeakTribute}
                      id="btn-listen-tribute"
                      className={`flex items-center gap-1.5 px-3.5 py-2 neo-border-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isPlayingVoice
                          ? 'bg-[#E63946] text-white'
                          : 'bg-[#264653] hover:bg-[#1f3842] text-white'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingVoice ? 'Stop Audio' : 'Audio Tribute'}</span>
                    </button>

                    <button
                      onClick={handlePrintCertificate}
                      id="btn-print-certificate"
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#E63946] hover:bg-[#d62839] text-white font-black uppercase text-xs tracking-wider neo-border-2 neo-shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Certificate</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
