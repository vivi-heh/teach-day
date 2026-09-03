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
  Share2,
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
    const text = `🍎 Teachers' Day 2026 Wish:\n"${card.headline}"\n\n${card.message}\n\n${card.favoriteQuote || ''}\n\n— From: ${card.senderName} (${card.senderRole})\nDedicated to: ${card.teacherName}`;
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
      case 'golden':
        return { bg: 'bg-[#FFF3B0]', border: 'border-[#121212]', tag: '🌟 Golden Tribute' };
      case 'chalkboard':
        return { bg: 'bg-[#A8DADC]', border: 'border-[#121212]', tag: '📚 Classroom Memory' };
      case 'watercolor':
        return { bg: 'bg-[#FFD166]', border: 'border-[#121212]', tag: '🌸 Heartfelt Blessing' };
      case 'origami':
        return { bg: 'bg-[#F4A261]', border: 'border-[#121212]', tag: '⚡ Curiosity & Growth' };
      case 'vintage':
      default:
        return { bg: 'bg-[#F1FAEE]', border: 'border-[#121212]', tag: '🌿 Everlasting Respect' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#264653] neo-border neo-shadow p-6 md:p-10 text-white grid-paper">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E63946] text-white text-[10px] font-black uppercase tracking-wider neo-border-2 neo-shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Teachers’ Day 2026 Wishes & Cards</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight italic font-sans text-white leading-tight">
            Words of Gratitude That Echo Forever
          </h1>

          <p className="text-sm sm:text-base text-stone-100 font-medium leading-relaxed">
            Every card below is open and immediately readable. No clicking or flipping needed. Dedicated to every educator who lights our path!
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
            onClick={() => setSelectedThemeFilter('golden')}
            id="filter-card-golden"
            className={`px-3 py-1.5 font-black uppercase whitespace-nowrap transition-all cursor-pointer neo-border-2 ${
              selectedThemeFilter === 'golden'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            🌟 Golden Tributes
          </button>
          <button
            onClick={() => setSelectedThemeFilter('chalkboard')}
            id="filter-card-chalkboard"
            className={`px-3 py-1.5 font-black uppercase whitespace-nowrap transition-all cursor-pointer neo-border-2 ${
              selectedThemeFilter === 'chalkboard'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            📚 Classroom Wisdom
          </button>
          <button
            onClick={() => setSelectedThemeFilter('watercolor')}
            id="filter-card-watercolor"
            className={`px-3 py-1.5 font-black uppercase whitespace-nowrap transition-all cursor-pointer neo-border-2 ${
              selectedThemeFilter === 'watercolor'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            🌸 Heartfelt Blessings
          </button>
          <button
            onClick={() => setSelectedThemeFilter('origami')}
            id="filter-card-origami"
            className={`px-3 py-1.5 font-black uppercase whitespace-nowrap transition-all cursor-pointer neo-border-2 ${
              selectedThemeFilter === 'origami'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            ⚡ Curiosity & Growth
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#121212]/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search wishes, messages, names..."
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
              className="bg-white neo-border neo-shadow-lg p-6 flex flex-col justify-between space-y-5 text-[#121212]"
            >
              {/* Card Top Information */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 ${badge.bg} neo-border-2 text-[10px] font-black uppercase tracking-wider text-[#121212]`}>
                    {badge.tag}
                  </span>
                  <span className="text-[11px] font-bold text-[#121212]/70 uppercase">
                    {card.date}
                  </span>
                </div>

                <div className="text-xs font-black uppercase text-[#E63946] tracking-wider mb-1">
                  Dedicated To: {card.teacherName}
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight text-[#121212] leading-snug">
                  {card.headline}
                </h3>

                {/* THE FULL WISH MESSAGE - ALWAYS 100% VISIBLE! */}
                <div className="mt-4 p-4 bg-[#F8F9FA] neo-border-2 space-y-3">
                  <p className="text-sm text-[#121212] font-normal leading-relaxed">
                    {card.message}
                  </p>

                  {card.favoriteQuote && (
                    <div className="pt-2 border-t border-[#121212]/15 text-xs font-serif italic text-[#121212] font-semibold">
                      {card.favoriteQuote}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Sender info, Reactions, Copy & Celebrate buttons */}
              <div className="space-y-3 pt-2 border-t-2 border-[#121212]/15">
                <div className="flex items-center justify-between text-xs font-black uppercase text-[#121212]">
                  <span>From: {card.senderName}</span>
                  <span className="text-[10px] font-bold text-[#121212]/70">{card.senderRole}</span>
                </div>

                {/* Reactions Row */}
                <div className="flex items-center justify-between bg-[#F1FAEE] p-1.5 neo-border-2 text-xs">
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
                    <span>🍎</span>
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
                    <span>🎓</span>
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
                    className="px-3 py-1.5 bg-white hover:bg-stone-100 text-[#121212] neo-border-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
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
