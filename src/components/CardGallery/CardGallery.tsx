import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  Heart,
  PlusCircle,
  Filter,
  Search,
  Copy,
  Check,
  Star,
  Award,
  Apple,
  GraduationCap,
  Terminal,
  Laptop,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Teacher, GreetingCard } from '../../types';
import { playPopClick, playSparkleChime, playSuccessTone } from '../../utils/audio';

interface CardGalleryProps {
  cards: GreetingCard[];
  teachers: Teacher[];
  onOpenCreateCard: (prefilledTeacherId?: string) => void;
  onReactToCard: (cardId: string, reactionType: 'love' | 'apple' | 'star' | 'respect') => void;
  onRevealCelebration?: (card: GreetingCard) => void;
}

export const CardGallery: React.FC<CardGalleryProps> = ({
  cards,
  teachers,
  onOpenCreateCard,
  onReactToCard,
  onRevealCelebration,
}) => {
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  const handleReaction = (cardId: string, type: 'love' | 'apple' | 'star' | 'respect') => {
    playPopClick();
    onReactToCard(cardId, type);
  };

  const handleCopyWish = (card: GreetingCard) => {
    const text = `Teachers' Day 2026 Tribute:\n"${card.headline}"\n\n${card.message}\n\n${card.favoriteQuote || ''}\n\n— From: ${card.senderName} (${card.senderRole})\nDedicated to: ${card.teacherName}`;
    navigator.clipboard.writeText(text);
    playSuccessTone();
    setCopiedCardId(card.id);
    setTimeout(() => setCopiedCardId(null), 2200);
  };

  const handleCelebrateCard = (card: GreetingCard) => {
    playSparkleChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E63946', '#E9C46A', '#2A9D8F', '#F4A261', '#1D3557'],
    });
    if (onRevealCelebration) {
      onRevealCelebration(card);
    }
  };

  const filteredCards = cards.filter((c) => {
    const matchesTheme = selectedThemeFilter === 'all' || c.theme === selectedThemeFilter;
    const matchesSearch =
      c.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  const getCardHeaderBadge = (theme: GreetingCard['theme']) => {
    switch (theme) {
      case 'cyber':
        return { bg: 'bg-[#00f5d4] text-[#0f172a]', border: 'border-white', tag: 'Code & Innovation' };
      case 'golden':
        return { bg: 'bg-[#FFF3B0]', border: 'border-[#121212]', tag: 'Golden Tribute' };
      case 'chalkboard':
        return { bg: 'bg-[#A8DADC]', border: 'border-[#121212]', tag: 'Classroom Memory' };
      case 'watercolor':
        return { bg: 'bg-[#FFD166]', border: 'border-[#121212]', tag: 'Heartfelt Blessing' };
      case 'origami':
        return { bg: 'bg-[#F4A261]', border: 'border-[#121212]', tag: 'Curiosity & Growth' };
      case 'vintage':
      default:
        return { bg: 'bg-[#F1FAEE]', border: 'border-[#121212]', tag: 'Everlasting Respect' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#264653] neo-border neo-shadow-lg p-6 md:p-10 text-white grid-paper">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E63946] text-white text-[10px] font-black uppercase tracking-wider neo-border-2 neo-shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Teachers’ Day 2026 Wishes & Cards</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight italic font-sans text-white leading-tight heading-pop-amber">
            Words of Gratitude That Echo Forever
          </h1>

          <p className="text-sm sm:text-base text-stone-100 font-medium leading-relaxed">
            Every card below is open and immediately readable. No clicking or flipping needed. Dedicated to every educator and mentor who lights our path!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenCreateCard()}
              id="btn-create-card-banner"
              className="px-5 py-2.5 bg-[#E9C46A] hover:bg-[#ffe082] text-[#121212] text-xs font-black uppercase tracking-wider neo-border-2 neo-shadow transition-all cursor-pointer flex items-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              <PlusCircle className="w-4 h-4 text-[#121212]" />
              <span>Write a New Tribute Card</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white neo-border neo-shadow p-4 text-[#121212]">
        {/* Filter by Theme / Category */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <Filter className="w-4 h-4 text-[#E63946] shrink-0 ml-1" />
          <button
            onClick={() => setSelectedThemeFilter('all')}
            id="filter-card-all"
            className={`px-3 py-1.5 font-black uppercase whitespace-nowrap transition-all cursor-pointer neo-border-2 ${
              selectedThemeFilter === 'all'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            All Cards ({cards.length})
          </button>
          <button
            onClick={() => setSelectedThemeFilter('cyber')}
            id="filter-card-cyber"
            className={`px-3 py-1.5 font-black uppercase whitespace-nowrap transition-all cursor-pointer neo-border-2 flex items-center gap-1.5 ${
              selectedThemeFilter === 'cyber'
                ? 'bg-[#00f5d4] text-[#0f172a] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-700" />
            <span>Code & Innovation</span>
          </button>
          <button
            onClick={() => setSelectedThemeFilter('golden')}
            id="filter-card-golden"
            className={`px-3 py-1.5 font-black uppercase whitespace-nowrap transition-all cursor-pointer neo-border-2 flex items-center gap-1.5 ${
              selectedThemeFilter === 'golden'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Golden Tributes</span>
          </button>
          <button
            onClick={() => setSelectedThemeFilter('chalkboard')}
            id="filter-card-chalkboard"
            className={`px-3 py-1.5 font-black uppercase whitespace-nowrap transition-all cursor-pointer neo-border-2 flex items-center gap-1.5 ${
              selectedThemeFilter === 'chalkboard'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2A9D8F]" />
            <span>Classroom Wisdom</span>
          </button>
          <button
            onClick={() => setSelectedThemeFilter('watercolor')}
            id="filter-card-watercolor"
            className={`px-3 py-1.5 font-black uppercase whitespace-nowrap transition-all cursor-pointer neo-border-2 flex items-center gap-1.5 ${
              selectedThemeFilter === 'watercolor'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#E63946] fill-[#E63946]" />
            <span>Heartfelt Blessings</span>
          </button>
          <button
            onClick={() => setSelectedThemeFilter('origami')}
            id="filter-card-origami"
            className={`px-3 py-1.5 font-black uppercase whitespace-nowrap transition-all cursor-pointer neo-border-2 flex items-center gap-1.5 ${
              selectedThemeFilter === 'origami'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Curiosity & Growth</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#121212]/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search wishes, messages, mentors..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F1FAEE] neo-border-2 text-xs font-bold text-[#121212] placeholder:text-stone-400 focus:outline-none focus:bg-white transition-colors"
          />
        </div>
      </section>

      {/* Cards Grid: Direct, visible text with high contrast and zero hidden text */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => {
          const badge = getCardHeaderBadge(card.theme);
          const isCopied = copiedCardId === card.id;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`neo-border neo-shadow-lg p-6 flex flex-col justify-between space-y-5 text-[#121212] ${
                card.theme === 'cyber' ? 'bg-[#0f172a] text-slate-100 neo-border-sky-400' : 'bg-white'
              }`}
            >
              {/* Card Top Information */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-1 ${badge.bg} neo-border-2 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      card.theme === 'cyber' ? 'text-[#0f172a]' : 'text-[#121212]'
                    }`}
                  >
                    {card.theme === 'cyber' ? (
                      <Laptop className="w-3 h-3" />
                    ) : (
                      <GraduationCap className="w-3 h-3" />
                    )}
                    <span>{badge.tag}</span>
                  </span>
                  <span
                    className={`text-[11px] font-bold uppercase ${
                      card.theme === 'cyber' ? 'text-cyan-300' : 'text-[#121212]/70'
                    }`}
                  >
                    {card.date}
                  </span>
                </div>

                <div
                  className={`text-xs font-black uppercase tracking-wider mb-1 ${
                    card.theme === 'cyber' ? 'text-cyan-400' : 'text-[#E63946]'
                  }`}
                >
                  Dedicated To: {card.teacherName}
                </div>

                <h3
                  className={`text-xl font-black uppercase tracking-tight leading-snug ${
                    card.theme === 'cyber' ? 'text-white heading-pop-light' : 'text-[#121212] heading-pop'
                  }`}
                >
                  {card.headline}
                </h3>

                {/* THE FULL WISH MESSAGE - ALWAYS 100% VISIBLE! */}
                <div
                  className={`mt-4 p-4 neo-border-2 space-y-3 ${
                    card.theme === 'cyber'
                      ? 'bg-[#1e293b] border-cyan-400 text-cyan-100 font-mono text-sm'
                      : 'bg-[#F8F9FA] border-[#121212] text-[#121212]'
                  }`}
                >
                  <p className="text-sm font-normal leading-relaxed">
                    {card.message}
                  </p>

                  {card.favoriteQuote && (
                    <div
                      className={`pt-2 border-t text-xs font-serif italic font-semibold ${
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

              {/* Card Footer: Sender info, Reactions, Copy & Celebrate buttons */}
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
                  <span className="text-[10px] font-bold opacity-80">{card.senderRole}</span>
                </div>

                {/* Reactions Row */}
                <div
                  className={`flex items-center justify-between p-1.5 neo-border-2 text-xs ${
                    card.theme === 'cyber' ? 'bg-[#1e293b] border-cyan-500/40' : 'bg-[#F1FAEE]'
                  }`}
                >
                  <button
                    onClick={() => handleReaction(card.id, 'love')}
                    id={`card-react-love-${card.id}`}
                    className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-rose-100 neo-border-2 text-[#121212] transition-colors cursor-pointer font-black text-[11px] active:translate-y-[1px]"
                    title="Send Love"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#E63946] fill-[#E63946]" />
                    <span>{card.reactions.love}</span>
                  </button>

                  <button
                    onClick={() => handleReaction(card.id, 'apple')}
                    id={`card-react-apple-${card.id}`}
                    className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-amber-100 neo-border-2 text-[#121212] transition-colors cursor-pointer font-black text-[11px] active:translate-y-[1px]"
                    title="Gift an Apple"
                  >
                    <Apple className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>{card.reactions.apple}</span>
                  </button>

                  <button
                    onClick={() => handleReaction(card.id, 'star')}
                    id={`card-react-star-${card.id}`}
                    className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-yellow-100 neo-border-2 text-[#121212] transition-colors cursor-pointer font-black text-[11px] active:translate-y-[1px]"
                    title="Award a Star"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{card.reactions.star}</span>
                  </button>

                  <button
                    onClick={() => handleReaction(card.id, 'respect')}
                    id={`card-react-respect-${card.id}`}
                    className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-emerald-100 neo-border-2 text-[#121212] transition-colors cursor-pointer font-black text-[11px] active:translate-y-[1px]"
                    title="Honor with Laurels"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#2A9D8F]" />
                    <span>{card.reactions.respect}</span>
                  </button>
                </div>

                {/* Quick Action Bar: Celebrate + Copy Wish */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => handleCelebrateCard(card)}
                    id={`btn-celebrate-card-${card.id}`}
                    className="px-3 py-1.5 bg-[#E9C46A] hover:bg-[#ffe082] text-[#121212] neo-border-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:translate-y-[1px]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>Shower Confetti</span>
                  </button>

                  <button
                    onClick={() => handleCopyWish(card)}
                    id={`btn-copy-wish-${card.id}`}
                    className={`px-3 py-1.5 neo-border-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                      card.theme === 'cyber'
                        ? 'bg-cyan-950 text-cyan-200 border-cyan-400 hover:bg-cyan-900'
                        : 'bg-white hover:bg-stone-100 text-[#121212]'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Wish'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-16 bg-[#F1FAEE] neo-border text-[#121212]">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#121212]" />
          <p className="text-sm font-black uppercase tracking-wider text-[#121212]">
            No cards found matching your filter.
          </p>
          <button
            onClick={() => {
              setSelectedThemeFilter('all');
              setSearchTerm('');
            }}
            className="mt-3 text-xs font-black uppercase text-[#E63946] underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
