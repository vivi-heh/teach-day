import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Gift,
  Award,
  BookOpen,
  Share2,
  Copy,
  Check,
  Flame,
  Star,
  Send,
  PlusCircle,
  ThumbsUp,
  Smile,
  Apple,
  GraduationCap,
  Terminal,
  Laptop,
  Code2,
  Shield,
  Hourglass,
  Rocket,
  Compass,
  Lightbulb,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GreetingCard, Shoutout } from '../../types';
import { playGiftRevealFanfare, playSparkleChime, playPopClick, playSuccessTone } from '../../utils/audio';

interface UniversalTributeHomeProps {
  cards: GreetingCard[];
  shoutouts: Shoutout[];
  onOpenCreateCard: () => void;
  onOpenSubmitShoutout: () => void;
  onReactToCard: (cardId: string, reactionType: 'love' | 'apple' | 'star' | 'respect') => void;
  onLikeShoutout: (shoutoutId: string) => void;
  onNavigateToTab: (tab: 'dashboard' | 'cards' | 'games' | 'memories') => void;
}

export const UniversalTributeHome: React.FC<UniversalTributeHomeProps> = ({
  cards,
  shoutouts,
  onOpenCreateCard,
  onOpenSubmitShoutout,
  onReactToCard,
  onLikeShoutout,
  onNavigateToTab,
}) => {
  const [isPlayingDedication, setIsPlayingDedication] = useState(false);
  const [copiedWishId, setCopiedWishId] = useState<string | null>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [claimedLaurels, setClaimedLaurels] = useState<{ [key: string]: boolean }>({});
  const [liveCounters, setLiveCounters] = useState({
    apples: 1420,
    hearts: 3890,
    applause: 2750,
    stars: 1980,
    codeLogic: 1640,
  });

  // Confetti blaster helper
  const triggerCelebrationConfetti = () => {
    playSparkleChime();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#E63946', '#E9C46A', '#2A9D8F', '#F4A261', '#1D3557'],
    });
  };

  // Text-to-speech for universal dedication
  const handleToggleDedicationVoice = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingDedication) {
      window.speechSynthesis.cancel();
      setIsPlayingDedication(false);
    } else {
      const speechText =
        "Happy Teachers' Day 2026! To every educator, mentor, and guide: whether you teach Computer Science, coding and algorithms, mathematics, literature, sciences, the arts, languages, or guide first steps in primary learning — this tribute is dedicated to YOU. Teaching is the singular profession that creates all other professions. Thank you for your endless patience, your unwavering belief in our dreams, and the quiet sacrifices you make every single day. We honor and celebrate you!";
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onend = () => setIsPlayingDedication(false);
      utterance.onerror = () => setIsPlayingDedication(false);

      setIsPlayingDedication(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyLetter = () => {
    const letterText = `Happy Teachers' Day 2026!\n\nDear Teacher,\nWherever you stand in front of a classroom today, we want you to know how deeply you are valued. Teaching is the one profession that creates all other professions. Behind every dream we dare to pursue stands an educator whose patience never wavered, whose encouragement carried us forward, and whose belief opened doors we never knew existed.\n\nWhether you teach Computer Science and algorithms, Literature, Sciences, Mathematics, or the Arts, thank you for your infinite patience, your daily kindness, and the wisdom you imprint on our hearts forever.\n\n— With eternal gratitude, All Your Students`;
    navigator.clipboard.writeText(letterText);
    setCopiedLetter(true);
    playSuccessTone();
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  const handleCopyWish = (card: GreetingCard) => {
    const wishText = `★ Teachers' Day 2026 Wish:\n"${card.headline}"\n\n${card.message}\n\n${card.favoriteQuote || ''}\n\n— Dedicated with gratitude to our teacher!`;
    navigator.clipboard.writeText(wishText);
    setCopiedWishId(card.id);
    playSuccessTone();
    setTimeout(() => setCopiedWishId(null), 2500);
  };

  const handleClaimLaurel = (laurelId: string) => {
    playGiftRevealFanfare();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#E9C46A', '#E63946', '#2A9D8F'],
    });
    setClaimedLaurels((prev) => ({ ...prev, [laurelId]: true }));
    setLiveCounters((prev) => ({ ...prev, stars: prev.stars + 1 }));
  };

  const handleIncrementCounter = (type: 'apples' | 'hearts' | 'applause' | 'stars' | 'codeLogic') => {
    playPopClick();
    setLiveCounters((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#E63946', '#E9C46A', '#2A9D8F'],
    });
  };

  const laurelsList = [
    {
      id: 'laurel-apple',
      icon: <Apple className="w-8 h-8 text-[#E63946]" />,
      title: 'The Golden Apple of Wisdom',
      subtitle: 'Awarded for Endless Clarity & Guidance',
      citation: 'For nourishing hungry minds day after day, turning confusing subjects into crystal-clear breakthroughs, and feeding our curiosity with boundless dedication.',
      bg: 'bg-[#FFF3B0]',
    },
    {
      id: 'laurel-torch',
      icon: <Flame className="w-8 h-8 text-amber-500 fill-amber-400" />,
      title: 'The Torch of Ignited Curiosity',
      subtitle: 'Awarded for Lifelong Inspiration',
      citation: 'For lighting a flame of wonder that burns forever inside every student you teach, proving that education is not filling a pail, but kindling a fire.',
      bg: 'bg-[#FFD166]',
    },
    {
      id: 'laurel-cyber',
      icon: <Terminal className="w-8 h-8 text-[#264653]" />,
      title: 'The Terminal of Computational Vision',
      subtitle: 'Awarded for Computer Science & Tech Mentorship',
      citation: 'For teaching students how to debug life’s infinite loops, construct creative software, and see logic and empathy as the truest human algorithms.',
      bg: 'bg-[#A8DADC]',
    },
    {
      id: 'laurel-patience',
      icon: <Trophy className="w-8 h-8 text-[#2A9D8F]" />,
      title: 'The Cup of Boundless Patience',
      subtitle: 'Awarded for Gentle Encouragement',
      citation: 'For the countless times you re-explained a lesson with a gentle smile, never making any learner feel small, and guiding us through our hardest mistakes.',
      bg: 'bg-[#F1FAEE]',
    },
    {
      id: 'laurel-compass',
      icon: <Compass className="w-8 h-8 text-[#E76F51]" />,
      title: 'The Compass of Life’s Direction',
      subtitle: 'Awarded for Character & Integrity',
      citation: 'For teaching us not just how to pass exams, but how to be resilient, empathetic, honest, and courageous human beings in the wider world.',
      bg: 'bg-[#F4A261]',
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Grand Universal Hero Banner */}
      <section className="relative overflow-hidden bg-[#264653] neo-border neo-shadow-lg p-5 sm:p-8 md:p-10 text-white grid-paper-dark">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#E63946] text-white text-xs font-black uppercase tracking-widest neo-border-2 neo-shadow-sm">
            <GraduationCap className="w-4 h-4 text-white animate-pulse" />
            <span>TEACHERS’ DAY 2026 TRIBUTE</span>
          </div>

          {/* Grand Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight italic font-sans text-white leading-tight heading-pop-white">
            HAPPY <span className="text-[#E9C46A] underline decoration-4 decoration-[#E63946]">TEACHERS’</span> DAY 2026!
          </h1>

          {/* Sub-headline container with guaranteed high contrast backdrop */}
          <div className="bg-[#1D3557]/90 sm:bg-[#1D3557]/80 neo-border-2 p-4 sm:p-6 neo-shadow-sm max-w-3xl mx-auto space-y-3">
            <p className="text-sm sm:text-base md:text-lg text-white font-extrabold leading-relaxed">
              To the patient guides, inspiring mentors, and quiet architects of our tomorrow — across every subject and every classroom.
            </p>

            <p className="text-xs sm:text-sm md:text-base text-stone-200 leading-relaxed font-semibold">
              Whether you teach <span className="inline-block px-2 py-0.5 bg-[#E9C46A] text-[#121212] font-black uppercase text-[11px] sm:text-xs tracking-wider neo-border-2">Computer Science & Coding</span>, Mathematics, Sciences, Literature, Arts, History, Languages, or guide first steps in primary learning: this tribute is dedicated to <strong className="text-[#E9C46A] font-black underline decoration-2">YOU</strong>.
            </p>
          </div>

          {/* Action Toolbar - Optimized for Mobile Thumb Reach and Tablets */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={triggerCelebrationConfetti}
              id="btn-hero-shower-confetti"
              className="px-5 py-3 sm:py-2.5 bg-[#E9C46A] hover:bg-[#ffe082] text-[#121212] font-black uppercase text-xs tracking-wider neo-border-2 neo-shadow transition-all cursor-pointer flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-[#E63946]" />
              <span>Shower Confetti</span>
            </button>

            <button
              onClick={handleToggleDedicationVoice}
              id="btn-hero-listen-voice"
              className={`px-5 py-3 sm:py-2.5 font-black uppercase text-xs tracking-wider neo-border-2 neo-shadow transition-all cursor-pointer flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] min-h-[44px] ${
                isPlayingDedication
                  ? 'bg-[#E63946] text-white animate-pulse'
                  : 'bg-white hover:bg-stone-100 text-[#121212]'
              }`}
            >
              {isPlayingDedication ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#264653]" />}
              <span>{isPlayingDedication ? 'Stop Audio' : 'Listen to Dedication'}</span>
            </button>

            <button
              onClick={onOpenCreateCard}
              id="btn-hero-write-wish"
              className="px-5 py-3 sm:py-2.5 bg-[#E63946] hover:bg-[#d62839] text-white font-black uppercase text-xs tracking-wider neo-border-2 neo-shadow transition-all cursor-pointer flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] min-h-[44px]"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Write a Wish</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Live Appreciation Reaction Bar */}
      <section className="bg-white neo-border neo-shadow p-4 sm:p-6 text-[#121212]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#E9C46A] neo-border-2 text-[10px] font-black uppercase tracking-wider mb-1">
              <Award className="w-3 h-3 text-[#121212]" />
              <span>Tap to Send Gratitude Tokens</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#121212] heading-pop">
              Live Gratitude Tokens for Mentors
            </h3>
            <p className="text-xs sm:text-sm text-[#121212]/80 font-medium">
              Click any token below to celebrate your teachers and contribute to the live tribute counters!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => handleIncrementCounter('apples')}
              id="btn-counter-apples"
              className="px-3 py-2.5 bg-[#FFF3B0] hover:bg-[#ffe680] neo-border-2 neo-shadow-sm flex items-center justify-between gap-2 text-left cursor-pointer transition-all active:translate-y-[1px] min-h-[48px]"
            >
              <div className="w-8 h-8 rounded bg-white neo-border flex items-center justify-center shrink-0">
                <Apple className="w-5 h-5 text-[#E63946]" />
              </div>
              <div className="truncate">
                <div className="text-sm sm:text-base font-black text-[#121212]">{liveCounters.apples.toLocaleString()}</div>
                <div className="text-[10px] font-bold uppercase text-[#121212]/80 truncate">Apples</div>
              </div>
            </button>

            <button
              onClick={() => handleIncrementCounter('hearts')}
              id="btn-counter-hearts"
              className="px-3 py-2.5 bg-[#FFD166] hover:bg-[#ffc63a] neo-border-2 neo-shadow-sm flex items-center justify-between gap-2 text-left cursor-pointer transition-all active:translate-y-[1px] min-h-[48px]"
            >
              <div className="w-8 h-8 rounded bg-white neo-border flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-[#E63946] fill-[#E63946]" />
              </div>
              <div className="truncate">
                <div className="text-sm sm:text-base font-black text-[#121212]">{liveCounters.hearts.toLocaleString()}</div>
                <div className="text-[10px] font-bold uppercase text-[#121212]/80 truncate">Hearts</div>
              </div>
            </button>

            <button
              onClick={() => handleIncrementCounter('applause')}
              id="btn-counter-applause"
              className="px-3 py-2.5 bg-[#A8DADC] hover:bg-[#91cfd2] neo-border-2 neo-shadow-sm flex items-center justify-between gap-2 text-left cursor-pointer transition-all active:translate-y-[1px] min-h-[48px]"
            >
              <div className="w-8 h-8 rounded bg-white neo-border flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#2A9D8F]" />
              </div>
              <div className="truncate">
                <div className="text-sm sm:text-base font-black text-[#121212]">{liveCounters.applause.toLocaleString()}</div>
                <div className="text-[10px] font-bold uppercase text-[#121212]/80 truncate">Applauds</div>
              </div>
            </button>

            <button
              onClick={() => handleIncrementCounter('stars')}
              id="btn-counter-stars"
              className="px-3 py-2.5 bg-[#F4A261] hover:bg-[#f18e40] neo-border-2 neo-shadow-sm flex items-center justify-between gap-2 text-left cursor-pointer transition-all active:translate-y-[1px] min-h-[48px]"
            >
              <div className="w-8 h-8 rounded bg-white neo-border flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div className="truncate">
                <div className="text-sm sm:text-base font-black text-[#121212]">{liveCounters.stars.toLocaleString()}</div>
                <div className="text-[10px] font-bold uppercase text-[#121212]/80 truncate">Stars</div>
              </div>
            </button>

            <button
              onClick={() => handleIncrementCounter('codeLogic')}
              id="btn-counter-code"
              className="col-span-2 sm:col-span-1 px-3 py-2.5 bg-[#E2ECE9] hover:bg-[#cde4de] neo-border-2 neo-shadow-sm flex items-center justify-between gap-2 text-left cursor-pointer transition-all active:translate-y-[1px] min-h-[48px]"
            >
              <div className="w-8 h-8 rounded bg-white neo-border flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5 text-[#264653]" />
              </div>
              <div className="truncate">
                <div className="text-sm sm:text-base font-black text-[#121212]">{liveCounters.codeLogic.toLocaleString()}</div>
                <div className="text-[10px] font-bold uppercase text-[#121212]/80 truncate">Code & Logic</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Open Letter of Gratitude to Every Teacher */}
      <section className="relative bg-[#FFFDF9] neo-border neo-shadow-lg p-6 sm:p-10 text-[#121212] space-y-6">
        {/* Top stationery decorative header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#121212]/15 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E63946] text-white neo-border-2 neo-shadow-sm flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-[#E63946]">
                OFFICIAL COMMENDATION // 2026
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#121212] heading-pop">
                An Open Letter of Infinite Gratitude
              </h2>
            </div>
          </div>

          <button
            onClick={handleCopyLetter}
            id="btn-copy-open-letter"
            className="px-3.5 py-2 bg-white hover:bg-stone-100 text-[#121212] neo-border-2 neo-shadow-sm text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
          >
            {copiedLetter ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#121212]" />}
            <span>{copiedLetter ? 'Copied Letter!' : 'Copy Letter to Share'}</span>
          </button>
        </div>

        {/* The Letter Body - High contrast, large, bold, crystal clear */}
        <div className="space-y-4 text-base sm:text-lg text-[#121212] leading-relaxed font-sans">
          <p className="font-bold text-xl text-[#121212]">
            Dear Teacher,
          </p>

          <p className="text-[#121212] leading-relaxed">
            Wherever you stand in front of a classroom today — whether you unravel equations, inspire through literature, explore scientific mysteries, guide artistic hands, coach resilience on the sports field, or introduce the very first letters of the alphabet to wide-eyed young learners: <strong>this tribute is wholeheartedly dedicated to YOU</strong>.
          </p>

          <p className="text-[#121212] leading-relaxed">
            Teaching is the singular profession that creates every other profession in human history. Yet beyond test scores and curriculums, your true impact lives in the quiet, unspoken moments: the encouraging nod when our confidence wavered, the extra fifteen minutes you gave after the bell rang, the patience that never ran thin, and the unwavering faith you showed in our dreams when we could not yet see them ourselves.
          </p>

          <p className="text-[#121212] leading-relaxed">
            Because of your guidance, we did not just learn facts; we learned how to think, how to question, how to pick ourselves up when we stumble, and how to treat others with empathy and respect.
          </p>

          <div className="bg-[#F1FAEE] neo-border-2 p-4 sm:p-5 my-3 text-sm sm:text-base font-medium text-[#121212] italic">
            “To the world you may just be a teacher, but to your students, you are a hero, a steady anchor, and an everlasting spark of light.”
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t-2 border-[#121212]/15 text-sm font-black uppercase text-[#121212]">
            <div>
              <span className="text-[#E63946]">Happy Teachers’ Day 2026!</span>
            </div>
            <div className="text-right">
              — With Eternal Admiration & Respect, <br />
              <span className="text-xs font-bold text-[#121212]/70 lowercase">From Every Grateful Student</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Universal Educator Laureates (5 Honors for Any Teacher to Claim) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#264653] text-white text-[10px] font-black uppercase tracking-wider neo-border-2 mb-1.5">
              <Award className="w-3.5 h-3.5 text-[#E9C46A]" />
              <span>Universal Honors & Laurels</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#121212] heading-pop">
              The 2026 Educator Laureate Citations
            </h2>
            <p className="text-xs sm:text-sm text-[#121212]/80 font-medium">
              Every educator deserves these honors. Click any laurel below to claim your tribute!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {laurelsList.map((laurel) => {
            const isClaimed = claimedLaurels[laurel.id];
            return (
              <div
                key={laurel.id}
                className={`${laurel.bg} neo-border neo-shadow p-5 flex flex-col justify-between space-y-4 text-[#121212]`}
              >
                <div>
                  <div className="w-12 h-12 bg-white neo-border-2 rounded flex items-center justify-center mb-3">
                    {laurel.icon}
                  </div>
                  <h3 className="font-black uppercase text-base tracking-tight text-[#121212] leading-snug">
                    {laurel.title}
                  </h3>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#121212]/70 mt-0.5">
                    {laurel.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-[#121212] font-medium leading-relaxed mt-3 pt-2 border-t-2 border-[#121212]/15">
                    {laurel.citation}
                  </p>
                </div>

                <button
                  onClick={() => handleClaimLaurel(laurel.id)}
                  id={`btn-claim-laurel-${laurel.id}`}
                  className={`w-full py-2 px-3 neo-border-2 font-black uppercase text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isClaimed
                      ? 'bg-[#121212] text-white neo-shadow-none'
                      : 'bg-white hover:bg-[#121212] hover:text-white text-[#121212] neo-shadow-sm'
                  }`}
                >
                  {isClaimed ? <Check className="w-3.5 h-3.5 text-[#E9C46A]" /> : <Award className="w-3.5 h-3.5" />}
                  <span>{isClaimed ? 'Honored & Claimed! ★' : 'Claim This Honor'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Direct Greeting Cards & Wishes (ALL TEXT 100% VISIBLE - NO CLICKING OR FLIPPING NEEDED!) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E63946] text-white text-[10px] font-black uppercase tracking-wider neo-border-2 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-white" />
              <span>Heartfelt Wishes & Blessings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#121212] heading-pop">
              Teachers’ Day 2026 Wishes & Tributes
            </h2>
            <p className="text-xs sm:text-sm text-[#121212]/80 font-medium">
              Every message below is open, readable, and written directly for any teacher across all disciplines to enjoy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCreateCard}
              id="btn-create-wish-card-feed"
              className="px-4 py-2 bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-xs tracking-wider neo-shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-[#E9C46A]" />
              <span>Post a Wish</span>
            </button>
            <button
              onClick={() => onNavigateToTab('cards')}
              id="btn-view-all-cards"
              className="px-4 py-2 bg-white hover:bg-stone-100 text-[#121212] neo-border-2 neo-shadow text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              View Full Gallery →
            </button>
          </div>
        </div>

        {/* Cards Grid: Notice that ALL TEXT is rendered directly, with high-contrast text-[#121212]! */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.slice(0, 6).map((card) => {
            const isCopied = copiedWishId === card.id;

            return (
              <div
                key={card.id}
                className={`neo-border neo-shadow-lg p-6 flex flex-col justify-between space-y-5 text-[#121212] ${
                  card.theme === 'cyber' ? 'bg-[#0f172a] text-slate-100 neo-border-sky-400' : 'bg-white'
                }`}
              >
                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-1 neo-border-2 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                        card.theme === 'cyber'
                          ? 'bg-[#00f5d4] text-[#0f172a] border-white'
                          : 'bg-[#E9C46A] text-[#121212]'
                      }`}
                    >
                      {card.theme === 'cyber' ? (
                        <Laptop className="w-3.5 h-3.5" />
                      ) : (
                        <GraduationCap className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {card.theme === 'cyber'
                          ? 'TO OUR COMPUTER SCIENCE & CODING MENTOR'
                          : 'TO OUR BELOVED TEACHER'}
                      </span>
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase ${
                        card.theme === 'cyber' ? 'text-cyan-300' : 'text-[#121212]/70'
                      }`}
                    >
                      {card.date}
                    </span>
                  </div>

                  <h3
                    className={`text-xl sm:text-2xl font-black uppercase tracking-tight leading-snug ${
                      card.theme === 'cyber' ? 'text-white heading-pop-light' : 'text-[#121212] heading-pop'
                    }`}
                  >
                    {card.headline}
                  </h3>

                  {/* The FULL Wish Message */}
                  <div
                    className={`mt-4 p-4 neo-border-2 space-y-3 ${
                      card.theme === 'cyber'
                        ? 'bg-[#1e293b] border-cyan-400 text-cyan-100 font-mono text-sm'
                        : 'bg-[#F8F9FA] border-[#121212] text-[#121212]'
                    }`}
                  >
                    <p className="text-sm sm:text-base font-normal leading-relaxed">
                      {card.message}
                    </p>

                    {card.favoriteQuote && (
                      <div
                        className={`pt-2 border-t text-xs sm:text-sm font-serif italic font-semibold ${
                          card.theme === 'cyber'
                            ? 'border-cyan-500/30 text-emerald-300'
                            : 'border-[#121212]/15 text-[#121212]'
                        }`}
                      >
                        {card.favoriteQuote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer and Interactive Reaction Buttons */}
                <div
                  className={`space-y-3 pt-2 border-t-2 ${
                    card.theme === 'cyber' ? 'border-cyan-500/30' : 'border-[#121212]/15'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between text-xs font-black uppercase ${
                      card.theme === 'cyber' ? 'text-cyan-200' : 'text-[#121212]'
                    }`}
                  >
                    <span>From: {card.senderName}</span>
                    <span className="text-[11px] font-bold opacity-80">{card.senderRole}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {/* Reactions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onReactToCard(card.id, 'love')}
                        id={`btn-react-love-${card.id}`}
                        className="px-2.5 py-1 bg-white hover:bg-rose-50 text-[#121212] neo-border-2 text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:translate-y-[1px]"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#E63946] fill-[#E63946]" />
                        <span>{card.reactions.love}</span>
                      </button>

                      <button
                        onClick={() => onReactToCard(card.id, 'apple')}
                        id={`btn-react-apple-${card.id}`}
                        className="px-2.5 py-1 bg-white hover:bg-amber-50 text-[#121212] neo-border-2 text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:translate-y-[1px]"
                      >
                        <Apple className="w-3.5 h-3.5 text-[#E63946]" />
                        <span>{card.reactions.apple}</span>
                      </button>

                      <button
                        onClick={() => onReactToCard(card.id, 'star')}
                        id={`btn-react-star-${card.id}`}
                        className="px-2.5 py-1 bg-white hover:bg-yellow-50 text-[#121212] neo-border-2 text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:translate-y-[1px]"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{card.reactions.star}</span>
                      </button>
                    </div>

                    {/* Copy button */}
                    <button
                      onClick={() => handleCopyWish(card)}
                      id={`btn-copy-wish-${card.id}`}
                      className={`px-3 py-1 neo-border-2 text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                        card.theme === 'cyber'
                          ? 'bg-cyan-900 text-cyan-200 border-cyan-400 hover:bg-cyan-800'
                          : 'bg-white hover:bg-[#121212] hover:text-white text-[#121212]'
                      }`}
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. The 5 Pillars of Every Great Mentor */}
      <section className="bg-[#E9C46A] neo-border neo-shadow p-6 sm:p-8 text-[#121212]">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#121212] text-white text-[10px] font-black uppercase tracking-wider neo-border-2 mb-1">
            <Award className="w-3.5 h-3.5 text-[#E9C46A]" />
            <span>The Heart of an Educator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#121212] heading-pop">
            The 5 Pillars of Every Great Mentor
          </h2>
          <p className="text-xs sm:text-sm text-[#121212]/85 font-medium">
            Qualities that make teachers the most unforgettable people in our lives across every discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white neo-border-2 p-5 space-y-2 text-[#121212] neo-shadow-sm">
            <div className="w-10 h-10 rounded bg-[#FFF3B0] neo-border flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <h4 className="font-black uppercase text-sm tracking-wider text-[#121212]">
              The Spark of Wonder
            </h4>
            <p className="text-xs text-[#121212] font-medium leading-relaxed">
              Taking complex or daunting ideas and making them feel like exciting, life-changing discoveries.
            </p>
          </div>

          <div className="bg-white neo-border-2 p-5 space-y-2 text-[#121212] neo-shadow-sm">
            <div className="w-10 h-10 rounded bg-[#E2ECE9] neo-border flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#2A9D8F]" />
            </div>
            <h4 className="font-black uppercase text-sm tracking-wider text-[#121212]">
              The Safe Harbor
            </h4>
            <p className="text-xs text-[#121212] font-medium leading-relaxed">
              Creating an encouraging sanctuary where questions are welcomed and making mistakes is respected.
            </p>
          </div>

          <div className="bg-white neo-border-2 p-5 space-y-2 text-[#121212] neo-shadow-sm">
            <div className="w-10 h-10 rounded bg-[#FDE2E4] neo-border flex items-center justify-center">
              <Hourglass className="w-6 h-6 text-[#E63946]" />
            </div>
            <h4 className="font-black uppercase text-sm tracking-wider text-[#121212]">
              The Gift of Time
            </h4>
            <p className="text-xs text-[#121212] font-medium leading-relaxed">
              Patiently waiting for the quiet student to find their voice and explaining things ten different ways.
            </p>
          </div>

          <div className="bg-white neo-border-2 p-5 space-y-2 text-[#121212] neo-shadow-sm">
            <div className="w-10 h-10 rounded bg-[#D8E2DC] neo-border flex items-center justify-center">
              <Rocket className="w-6 h-6 text-[#264653]" />
            </div>
            <h4 className="font-black uppercase text-sm tracking-wider text-[#121212]">
              The Wings of Faith
            </h4>
            <p className="text-xs text-[#121212] font-medium leading-relaxed">
              Believing in our future potential long before we had the courage to believe in ourselves.
            </p>
          </div>

          <div className="bg-white neo-border-2 p-5 space-y-2 text-[#121212] neo-shadow-sm">
            <div className="w-10 h-10 rounded bg-[#E0F2FE] neo-border flex items-center justify-center">
              <Laptop className="w-6 h-6 text-sky-600" />
            </div>
            <h4 className="font-black uppercase text-sm tracking-wider text-[#121212]">
              The Logic of Innovation
            </h4>
            <p className="text-xs text-[#121212] font-medium leading-relaxed">
              Teaching how to debug errors calmly, embrace computational thinking, and build solutions with empathy.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Wall of Gratitude & Student Notes */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2A9D8F] text-white text-[10px] font-black uppercase tracking-wider neo-border-2 mb-1.5">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Notes from Grateful Students</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#121212] heading-pop">
              Wall of Gratitude & Student Notes
            </h2>
            <p className="text-xs sm:text-sm text-[#121212]/80 font-medium">
              Real, authentic appreciation notes written by students to teachers across all disciplines.
            </p>
          </div>

          <button
            onClick={onOpenSubmitShoutout}
            id="btn-home-post-gratitude"
            className="px-4 py-2 bg-[#E63946] hover:bg-[#d62839] text-white font-black uppercase text-xs tracking-wider neo-shadow transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Note of Gratitude</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shoutouts.map((note) => (
            <div
              key={note.id}
              className="bg-white neo-border neo-shadow p-5 flex flex-col justify-between space-y-4 text-[#121212]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-[#FFF3B0] neo-border-2 text-[10px] font-black uppercase text-[#121212]">
                    {note.tag}
                  </span>
                  <span className="text-[10px] font-bold text-[#121212]/60 uppercase">
                    {note.timestamp}
                  </span>
                </div>

                <div className="text-xs font-black uppercase text-[#E63946] mb-2">
                  {note.teacherName}
                </div>

                <p className="text-xs sm:text-sm text-[#121212] font-medium leading-relaxed">
                  "{note.message}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#121212]/15 flex items-center justify-between text-xs font-black text-[#121212]">
                <div>
                  <span>— {note.studentName}</span>
                  <div className="text-[10px] font-bold text-[#121212]/60 uppercase">{note.gradeOrClass}</div>
                </div>

                <button
                  onClick={() => onLikeShoutout(note.id)}
                  id={`btn-like-note-${note.id}`}
                  className="px-2.5 py-1 bg-white hover:bg-rose-50 neo-border-2 text-xs font-black flex items-center gap-1 cursor-pointer active:translate-y-[1px]"
                >
                  <Heart className="w-3.5 h-3.5 text-[#E63946] fill-[#E63946]" />
                  <span>{note.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
