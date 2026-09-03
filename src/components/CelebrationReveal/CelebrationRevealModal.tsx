import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Award,
  Gift,
  Heart,
  RotateCcw,
  Volume2,
  Printer,
  BookOpen,
  Share2,
  Flame,
  Check,
  PartyPopper,
  Feather,
  Flower2,
  Trophy,
  PenTool,
  Mail,
  MessageSquare,
  Ribbon,
  Star,
  Medal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CelebrationAnimationType, CelebrationRevealItem, GiftWrapStyle } from '../../types';
import { CelebrationCanvas } from './CelebrationCanvas';
import {
  playCelebrationSoundByType,
  playSparkleChime,
  playPopClick,
  playGiftRevealFanfare,
} from '../../utils/audio';

interface CelebrationRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CelebrationRevealItem | null;
  autoUnwrap?: boolean;
  onAnimationChange?: (newType: CelebrationAnimationType) => void;
}

export const CelebrationRevealModal: React.FC<CelebrationRevealModalProps> = ({
  isOpen,
  onClose,
  item,
  autoUnwrap = true,
  onAnimationChange,
}) => {
  const [stage, setStage] = useState<'wrapped' | 'unwrapping' | 'revealed'>('wrapped');
  const [currentAnim, setCurrentAnim] = useState<CelebrationAnimationType>('fireworks');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [sparkleCount, setSparkleCount] = useState(0);

  useEffect(() => {
    if (isOpen && item) {
      setCurrentAnim(item.animationType || 'fireworks');
      if (autoUnwrap) {
        // Run automatic dramatic unwrap sequence
        handleUnwrap(item.animationType || 'fireworks');
      } else {
        setStage('wrapped');
      }
    } else {
      setStage('wrapped');
      if (isPlayingAudio && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      }
    }
  }, [isOpen, item, autoUnwrap]);

  if (!isOpen || !item) return null;

  const handleUnwrap = (animType = currentAnim) => {
    playSparkleChime();
    setStage('unwrapping');

    setTimeout(() => {
      setStage('revealed');
      playCelebrationSoundByType(animType);

      // Trigger celebratory burst
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.45 },
        colors: ['#E63946', '#E9C46A', '#F4A261', '#A8DADC', '#264653'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.15, y: 0.55 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.85, y: 0.55 },
        });
      }, 250);
    }, 1100);
  };

  const handleSwitchAnimation = (newAnim: CelebrationAnimationType) => {
    playPopClick();
    setCurrentAnim(newAnim);
    playCelebrationSoundByType(newAnim);

    if (onAnimationChange) {
      onAnimationChange(newAnim);
    }

    // Boost celebratory particles
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#E9C46A', '#E63946', '#A8DADC'],
    });
  };

  const handleReplay = () => {
    playPopClick();
    setStage('wrapped');
    setTimeout(() => {
      handleUnwrap(currentAnim);
    }, 200);
  };

  const handleExtraSparkles = () => {
    playSparkleChime();
    setSparkleCount((prev) => prev + 1);
    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD166', '#E63946', '#06D6A0'],
    });
  };

  const handleSpeechReadout = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const text =
      activeType === 'gift'
        ? `Celebration for ${resolvedRecipientName}. Gift: ${resolvedTitle}. Message from ${resolvedSenderName}: ${resolvedMessage}.`
        : `Greeting for ${resolvedRecipientName}. ${resolvedTitle}. From ${resolvedSenderName}: ${resolvedMessage}.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const animationOptions: { id: CelebrationAnimationType; name: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'fireworks', name: 'Fireworks', icon: <Sparkles className="w-4 h-4 mx-auto text-amber-500" />, desc: 'Starry Rocket Bursts' },
    { id: 'balloons', name: 'Balloons', icon: <PartyPopper className="w-4 h-4 mx-auto text-rose-500" />, desc: 'Sky Lanterns & Balloons' },
    { id: 'origami', name: 'Origami', icon: <Feather className="w-4 h-4 mx-auto text-cyan-600" />, desc: 'Flying Peace Cranes' },
    { id: 'blossom', name: 'Blossoms', icon: <Flower2 className="w-4 h-4 mx-auto text-pink-500" />, desc: 'Floral Petal Whirlwind' },
    { id: 'trophy', name: 'Fanfare', icon: <Trophy className="w-4 h-4 mx-auto text-amber-600" />, desc: 'Confetti Cannons & Gold' },
    { id: 'chalkboard', name: 'Chalk Magic', icon: <PenTool className="w-4 h-4 mx-auto text-emerald-600" />, desc: 'Glowing Wisdom Sparks' },
  ];

  const getWrapBoxDesign = (wrapStyle = 'crimson') => {
    switch (wrapStyle) {
      case 'gold':
        return {
          box: 'bg-[#E9C46A] border-[#121212]',
          ribbon: 'bg-[#E63946] border-[#121212]',
          bow: <Ribbon className="w-6 h-6 text-[#E63946]" />,
          tagBg: 'bg-white',
        };
      case 'emerald':
        return {
          box: 'bg-[#2A9D8F] text-white border-[#121212]',
          ribbon: 'bg-[#E9C46A] border-[#121212]',
          bow: <Gift className="w-6 h-6 text-[#E9C46A]" />,
          tagBg: 'bg-[#F1FAEE] text-[#121212]',
        };
      case 'bento':
        return {
          box: 'bg-[#F4A261] border-[#121212]',
          ribbon: 'bg-[#264653] border-[#121212]',
          bow: <Award className="w-6 h-6 text-[#264653]" />,
          tagBg: 'bg-white',
        };
      case 'midnight':
        return {
          box: 'bg-[#264653] text-white border-[#121212]',
          ribbon: 'bg-[#E9C46A] border-[#121212]',
          bow: <Sparkles className="w-6 h-6 text-[#E9C46A]" />,
          tagBg: 'bg-[#E9C46A] text-[#121212]',
        };
      case 'teal':
        return {
          box: 'bg-[#A8DADC] text-[#121212] border-[#121212]',
          ribbon: 'bg-[#E63946] border-[#121212]',
          bow: <Ribbon className="w-6 h-6 text-[#E63946]" />,
          tagBg: 'bg-white text-[#121212]',
        };
      case 'ochre':
        return {
          box: 'bg-[#F4A261] text-[#121212] border-[#121212]',
          ribbon: 'bg-[#121212] text-white border-[#121212]',
          bow: <Star className="w-6 h-6 text-amber-500 fill-amber-500" />,
          tagBg: 'bg-white text-[#121212]',
        };
      case 'slate':
        return {
          box: 'bg-[#264653] text-white border-[#121212]',
          ribbon: 'bg-[#A8DADC] border-[#121212]',
          bow: <Medal className="w-6 h-6 text-amber-400" />,
          tagBg: 'bg-[#E9C46A] text-[#121212]',
        };
      case 'crimson':
      default:
        return {
          box: 'bg-[#E63946] text-white border-[#121212]',
          ribbon: 'bg-[#E9C46A] border-[#121212]',
          bow: <Ribbon className="w-6 h-6 text-amber-500" />,
          tagBg: 'bg-white text-[#121212]',
        };
    }
  };

  // Normalize data payload
  const d: any = item.data || {};
  const activeType = item.type;
  const resolvedRecipientName =
    item.recipientName ||
    d.teacherName ||
    d.name ||
    'Honored Educator';
  const resolvedSenderName =
    item.senderName ||
    d.studentName ||
    d.senderName ||
    'Dedicated Student';
  const resolvedSenderGroup =
    item.senderGroup ||
    d.studentGroup ||
    d.senderRole ||
    d.gradeOrClass ||
    '';
  const resolvedTitle =
    item.title ||
    d.giftName ||
    d.headline ||
    (d.gift ? d.gift.giftTitle : undefined) ||
    (activeType === 'gift' ? 'Celebratory Student Gift' : (activeType === 'card' ? 'Heartfelt Greeting Card' : 'Student Tribute Shout-out'));
  const resolvedSubtitle =
    item.subtitle ||
    d.giftType ||
    d.frontDesign ||
    (d.gift ? d.gift.badgeName : undefined) ||
    'National Teachers’ Day Dedication';
  const resolvedMessage =
    item.message ||
    d.message ||
    (d.gift ? d.gift.studentMessage : '');
  const resolvedQuote =
    item.quote ||
    d.favoriteQuote ||
    (d.gift ? d.gift.revealQuote : undefined);
  const resolvedIcon =
    item.icon ||
    d.giftIcon ||
    (d.gift ? d.gift.virtualTrophy : undefined);
  const resolvedBadgeName =
    item.badgeName ||
    (d.gift ? d.gift.badgeName : undefined) ||
    d.giftName ||
    d.tag ||
    'Special Tribute';
  const resolvedWrapStyle =
    item.wrapStyle ||
    d.wrapStyle ||
    'crimson';
  const resolvedDate =
    item.date ||
    d.date ||
    d.timestamp ||
    'National Teachers’ Day 2026';
  const resolvedPhotoUrl =
    item.photoUrl ||
    d.photoUrl;

  const wrapDesign = getWrapBoxDesign(resolvedWrapStyle);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-[#FDFCFB] text-[#121212] neo-border neo-shadow-lg overflow-hidden my-2 sm:my-8 max-h-[94vh] flex flex-col"
      >
        {/* Fullscreen Celebration Canvas (Active during revealed stage) */}
        {stage === 'revealed' && (
          <CelebrationCanvas
            animationType={currentAnim}
            className="rounded-none pointer-events-none"
          />
        )}

        {/* Modal Top Ribbon Header */}
        <div className="relative z-20 flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b-[3px] border-[#121212] bg-[#F1FAEE] shrink-0">
          <div className="flex items-center gap-2">
            <span className="neo-border-2 bg-[#E9C46A] p-1.5 text-sm text-[#121212] flex items-center justify-center shrink-0">
              {activeType === 'gift' ? (
                <Gift className="w-4 h-4 text-[#121212]" />
              ) : activeType === 'card' ? (
                <Mail className="w-4 h-4 text-[#121212]" />
              ) : (
                <MessageSquare className="w-4 h-4 text-[#121212]" />
              )}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-black uppercase tracking-tight text-[#121212] text-xs sm:text-base italic">
                {activeType === 'gift' ? 'Surprise Gift Dedication' : activeType === 'card' ? 'Heartfelt Wish Reveal' : 'Classroom Shout-out'}
              </span>
              <span className="px-2 py-0.5 neo-border-2 bg-[#A8DADC] text-[#121212] text-[9px] sm:text-[10px] font-black uppercase tracking-wider truncate max-w-[140px] sm:max-w-none">
                To {resolvedRecipientName}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (isPlayingAudio && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            id="btn-close-celebration-modal"
            className="p-1.5 text-[#121212] bg-white hover:bg-[#E63946] hover:text-white neo-border-2 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="relative z-20 p-4 sm:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* STAGE 1: WRAPPED STATE */}
            {stage === 'wrapped' && (
              <motion.div
                key="stage-wrapped"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.08 }}
                className="flex flex-col items-center text-center py-6"
              >
                <div
                  className="relative mb-6 cursor-pointer group"
                  onClick={() => handleUnwrap(currentAnim)}
                >
                  {activeType === 'gift' ? (
                    /* 3D Wrapped Gift Box */
                    <motion.div
                      animate={{
                        y: [0, -6, 0],
                        rotate: [0, -1, 1, 0],
                      }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      className={`relative w-44 h-44 ${wrapDesign.box} neo-border neo-shadow-lg flex items-center justify-center transform group-hover:scale-105 transition-transform`}
                    >
                      {/* Ribbons */}
                      <div
                        className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 ${wrapDesign.ribbon} border-x-2 border-[#121212]`}
                      />
                      <div
                        className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 ${wrapDesign.ribbon} border-y-2 border-[#121212]`}
                      />

                      {/* Bow */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#E9C46A] neo-border flex items-center justify-center text-[#121212] text-xl neo-shadow-sm">
                        {wrapDesign.bow}
                      </div>

                      {/* Label Tag */}
                      <div className={`z-10 ${wrapDesign.tagBg} px-3 py-1.5 neo-border-2 text-[11px] font-black uppercase tracking-wider text-[#121212] flex items-center gap-1.5 neo-shadow-sm`}>
                        <Award className="w-3.5 h-3.5 text-[#E63946]" />
                        <span className="truncate max-w-[120px]">{resolvedTitle}</span>
                      </div>
                    </motion.div>
                  ) : (
                    /* Sealed Royal Envelope */
                    <motion.div
                      animate={{
                        y: [0, -6, 0],
                        rotate: [0, -0.5, 0.5, 0],
                      }}
                      transition={{ duration: 2.8, repeat: Infinity }}
                      className="relative w-52 h-36 bg-[#E9C46A] neo-border neo-shadow-lg flex flex-col items-center justify-center p-3 group-hover:scale-105 transition-transform"
                    >
                      <div className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-widest text-[#121212]/60">
                        AIR MAIL • DEDICATION
                      </div>
                      <div className="w-10 h-10 neo-border-2 bg-[#E63946] text-white flex items-center justify-center rounded-full text-base font-black shadow-inner mb-1">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-black text-xs uppercase tracking-tight text-[#121212]">
                        For: {resolvedRecipientName}
                      </span>
                      <span className="text-[10px] font-bold text-[#121212]/80 mt-0.5">
                        By: {resolvedSenderName}
                      </span>
                    </motion.div>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight italic text-[#121212] mb-1.5 font-sans heading-pop">
                  {resolvedTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#121212]/80 max-w-md mx-auto mb-6 font-medium leading-relaxed">
                  Dedicated by <span className="font-black text-[#E63946]">{resolvedSenderName}</span>
                  {resolvedSenderGroup && ` (${resolvedSenderGroup})`} to honor their unforgettable impact.
                </p>

                <button
                  onClick={() => handleUnwrap(currentAnim)}
                  id="btn-reveal-now"
                  className="px-8 py-3.5 bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-xs sm:text-sm tracking-wider neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#E9C46A]" />
                  <span>Reveal With {animationOptions.find((a) => a.id === currentAnim)?.name || 'Celebration'}!</span>
                </button>
              </motion.div>
            )}

            {/* STAGE 2: UNWRAPPING ANTICIPATION ANIMATION */}
            {stage === 'unwrapping' && (
              <motion.div
                key="stage-unwrapping"
                className="flex flex-col items-center text-center py-12"
              >
                <motion.div
                  animate={{
                    x: [-6, 6, -8, 8, -4, 4, 0],
                    rotate: [-3, 3, -4, 4, -2, 2, 0],
                    scale: [1, 1.05, 0.98, 1.1, 1.02, 1.15],
                  }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-40 h-40 bg-[#F4A261] neo-border neo-shadow-lg flex items-center justify-center text-4xl"
                >
                  <Sparkles className="w-12 h-12 text-[#121212] animate-spin" />
                </motion.div>

                <motion.p
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="mt-6 text-[#E63946] font-black uppercase tracking-wider text-sm"
                >
                  Unveiling the celebration...
                </motion.p>
              </motion.div>
            )}

            {/* STAGE 3: FULL CELEBRATION REVEAL */}
            {stage === 'revealed' && (
              <motion.div
                key="stage-revealed"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                className="space-y-6"
              >
                {/* Main Card / Trophy Display Panel */}
                <div className="relative bg-[#F1FAEE] neo-border neo-shadow p-5 sm:p-7 overflow-hidden">
                  {/* Decorative Geometric Corners */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-[3px] border-l-[3px] border-[#121212]" />
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-[3px] border-r-[3px] border-[#121212]" />
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-[3px] border-l-[3px] border-[#121212]" />
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-[3px] border-r-[3px] border-[#121212]" />

                  {/* Header Title Crest */}
                  <div className="text-center mb-5">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 12 }}
                      className="inline-flex items-center justify-center w-16 h-16 neo-border bg-[#E9C46A] text-[#121212] neo-shadow-sm mb-2.5"
                    >
                      <Trophy className="w-8 h-8 text-[#121212]" />
                    </motion.div>

                    <div className="text-[10px] uppercase font-black tracking-widest text-[#E63946] mb-1">
                      {activeType === 'gift' ? '★ Official Student Dedication ★' : activeType === 'card' ? '★ Heartfelt Greeting Card ★' : '★ Student Shout-out Tribute ★'}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight italic text-[#121212] font-sans heading-pop">
                      {resolvedTitle}
                    </h2>

                    <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#121212]/75">
                        Presented to: <strong className="text-[#121212]">{resolvedRecipientName}</strong>
                      </span>
                      {resolvedBadgeName && (
                        <span className="px-2 py-0.5 bg-[#A8DADC] neo-border-2 text-[#121212] text-[10px] font-black uppercase">
                          {resolvedBadgeName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Optional Photo from memories */}
                  {resolvedPhotoUrl && (
                    <div className="mb-4 neo-border-2 overflow-hidden bg-white max-w-sm mx-auto neo-shadow-sm">
                      <img
                        src={resolvedPhotoUrl}
                        alt="Classroom Memory"
                        className="w-full h-48 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Optional Quote / Highlight */}
                  {resolvedQuote && (
                    <div className="p-3.5 bg-white neo-border-2 border-l-[5px] border-l-[#E63946] text-[#121212] text-xs sm:text-sm font-serif italic mb-4 neo-shadow-sm">
                      “{resolvedQuote}”
                    </div>
                  )}

                  {/* Personal Message Card */}
                  <div className="bg-white neo-border-2 p-4 sm:p-5 text-[#121212] text-xs sm:text-sm leading-relaxed mb-4 neo-shadow-sm">
                    <p className="font-serif italic text-stone-900 leading-relaxed whitespace-pre-line">
                      {resolvedMessage}
                    </p>

                    <div className="mt-4 pt-3 border-t-2 border-[#121212]/15 flex items-center justify-between flex-wrap gap-2 text-xs font-black uppercase tracking-wider text-[#E63946]">
                      <span>
                        — {resolvedSenderName} {resolvedSenderGroup && `(${resolvedSenderGroup})`}
                      </span>
                      <span className="flex items-center gap-1 text-[#121212]/70 text-[11px]">
                        <Heart className="w-3.5 h-3.5 fill-[#E63946] text-[#E63946]" />
                        {resolvedDate}
                      </span>
                    </div>
                  </div>

                  {/* Celebration Effect Switcher */}
                  <div className="bg-[#FDFCFB] neo-border-2 p-3 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#121212] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#E63946]" />
                        <span>Celebration Animation Theme:</span>
                      </span>
                      <span className="text-[10px] font-black text-[#E63946] uppercase">
                        {animationOptions.find((a) => a.id === currentAnim)?.name} Active
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {animationOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSwitchAnimation(opt.id)}
                          className={`p-1.5 neo-border-2 text-center transition-all cursor-pointer ${
                            currentAnim === opt.id
                              ? 'bg-[#E9C46A] neo-shadow-sm text-[#121212]'
                              : 'bg-white hover:bg-[#F1FAEE] text-[#121212]'
                          }`}
                          title={opt.desc}
                        >
                          <div className="py-1">{opt.icon}</div>
                          <div className="text-[9px] font-black uppercase tracking-tight mt-0.5 truncate">
                            {opt.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Interactive Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReplay}
                      id="btn-replay-celebration"
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#F1FAEE] hover:bg-white text-[#121212] text-xs font-black uppercase tracking-wider neo-border-2 neo-shadow-sm transition-all cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px]"
                      title="Replay unwrap and reveal animation"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Replay</span>
                    </button>

                    <button
                      onClick={handleExtraSparkles}
                      id="btn-extra-sparkles"
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#E9C46A] hover:bg-[#dfba5f] text-[#121212] text-xs font-black uppercase tracking-wider neo-border-2 neo-shadow-sm transition-all cursor-pointer active:translate-x-1 active:translate-y-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Blast Confetti {sparkleCount > 0 ? `(${sparkleCount})` : ''}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSpeechReadout}
                      id="btn-speech-tribute"
                      className={`flex items-center gap-1.5 px-3 py-2 neo-border-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-[#E63946] text-white'
                          : 'bg-[#264653] hover:bg-[#1e3843] text-white'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingAudio ? 'Stop Voice' : 'Listen'}</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      id="btn-print-tribute"
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E63946] hover:bg-[#d62839] text-white font-black uppercase text-xs tracking-wider neo-border-2 neo-shadow-sm transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
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
