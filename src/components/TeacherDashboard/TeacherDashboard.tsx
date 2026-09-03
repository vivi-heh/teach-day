import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Gift,
  Heart,
  Award,
  BookOpen,
  MessageSquareHeart,
  PlusCircle,
  Search,
  CheckCircle2,
  Share2,
  Calendar,
  ThumbsUp,
  Flame,
  Feather,
  Cpu,
  Hourglass,
  Trophy,
  Compass,
  Palette,
  ShieldAlert,
  Brush,
  Leaf,
  Sun,
  Scale,
} from 'lucide-react';
import { Teacher, GreetingCard, Shoutout, StudentGift } from '../../types';
import { GiftSurpriseModal } from './GiftSurpriseModal';
import { playPopClick, playSparkleChime } from '../../utils/audio';

interface TeacherDashboardProps {
  teachers: Teacher[];
  selectedTeacherId: string;
  onSelectTeacher: (id: string) => void;
  cards: GreetingCard[];
  shoutouts: Shoutout[];
  studentGifts?: StudentGift[];
  onGiftUnlocked: (teacherId: string) => void;
  onOpenAddTeacherModal: () => void;
  onOpenCreateCard: (prefilledTeacherId?: string) => void;
  onOpenSendGiftModal?: (prefilledTeacherId?: string) => void;
  onRevealStudentGift?: (gift: StudentGift) => void;
  onSendReaction: (teacherId: string, type: 'apple' | 'heart' | 'highfive') => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teachers,
  selectedTeacherId,
  onSelectTeacher,
  cards,
  shoutouts,
  studentGifts = [],
  onGiftUnlocked,
  onOpenAddTeacherModal,
  onOpenCreateCard,
  onOpenSendGiftModal,
  onRevealStudentGift,
  onSendReaction,
}) => {
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [floatingReaction, setFloatingReaction] = useState<{ text: string; id: number } | null>(null);

  const currentTeacher =
    teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cards dedicated specifically to this teacher or to all
  const teacherCards = cards.filter(
    (c) => c.teacherId === currentTeacher.id || c.teacherId === 'all'
  );

  // Shoutouts for this teacher
  const teacherShoutouts = shoutouts.filter(
    (s) => s.teacherId === currentTeacher.id
  );

  // Student gifts dedicated to this teacher
  const teacherStudentGifts = studentGifts.filter(
    (g) => g.teacherId === currentTeacher.id
  );

  const handleSendAppreciation = (type: 'apple' | 'heart' | 'highfive') => {
    playPopClick();
    onSendReaction(currentTeacher.id, type);
    const emojiMap = { apple: '🍎 +1 Apple Gifted!', heart: '❤️ +1 High-Five!', highfive: '✋ Awesome Mentorship!' };
    setFloatingReaction({ text: emojiMap[type], id: Date.now() });
    setTimeout(() => {
      setFloatingReaction(null);
    }, 1800);
  };

  const getAccoladeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Feather':
        return <Feather className="w-5 h-5 text-amber-500" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-yellow-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Hourglass':
        return <Hourglass className="w-5 h-5 text-indigo-500" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-blue-500" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-pink-500" />;
      case 'Brush':
        return <Brush className="w-5 h-5 text-purple-500" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5 text-emerald-500" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-teal-500" />;
      default:
        return <Award className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Educator Selector Strip */}
      <section className="bg-white neo-border neo-shadow p-4 md:p-6 text-[#121212]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="neo-border-2 bg-[#F1FAEE] p-1 text-base">👩‍🏫👨‍🏫</span>
              <h2 className="text-xl font-black uppercase tracking-tight italic font-sans text-[#121212]">
                Educator <span className="text-[#E63946]">Roster</span> & Tribute Dashboards
              </h2>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#121212]/70 mt-1">
              Select any honored mentor to view tributes, unlock surprise gifts, and send appreciation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search filter input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#121212]/60" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find educator by name..."
                className="pl-9 pr-3 py-1.5 bg-[#F1FAEE] neo-border-2 text-xs font-bold text-[#121212] placeholder:text-stone-400 focus:outline-none focus:bg-white transition-colors w-44 sm:w-56"
              />
            </div>

            {/* Add Custom Teacher Button */}
            <button
              onClick={onOpenAddTeacherModal}
              id="btn-add-educator"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#A8DADC] hover:bg-[#90c9cc] text-[#121212] text-xs font-black uppercase tracking-wider neo-border-2 neo-shadow-sm transition-all cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#121212]" />
              <span>Add Educator</span>
            </button>
          </div>
        </div>

        {/* Carousel / Pills of Teachers */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {filteredTeachers.map((teacher) => {
            const isSelected = teacher.id === currentTeacher.id;
            return (
              <button
                key={teacher.id}
                onClick={() => {
                  playPopClick();
                  onSelectTeacher(teacher.id);
                }}
                id={`teacher-tab-${teacher.id}`}
                className={`flex items-center gap-3 px-3.5 py-2.5 neo-border-2 transition-all cursor-pointer whitespace-nowrap text-left shrink-0 ${
                  isSelected
                    ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm scale-[1.02]'
                    : 'bg-[#F1FAEE] hover:bg-white text-[#121212]'
                }`}
              >
                <div className="relative w-10 h-10 neo-border-2 bg-white overflow-hidden shrink-0">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {teacher.gift.giftUnlocked && (
                    <div className="absolute -top-1 -right-1 bg-[#E63946] text-white p-0.5 text-[9px] font-black border border-[#121212]" title="Gift Unlocked">
                      ✨
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-black text-xs uppercase tracking-tight leading-tight flex items-center gap-1">
                    <span>{teacher.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#121212]" />}
                  </div>
                  <div
                    className={`text-[10px] font-bold tracking-wider uppercase leading-tight mt-0.5 ${
                      isSelected ? 'text-[#121212]/80' : 'text-[#121212]/60'
                    }`}
                  >
                    {teacher.department}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Selected Educator Profile Hero */}
      <section className="bg-white neo-border neo-shadow overflow-hidden text-[#121212] relative grid-paper">
        {/* Banner Cover Image with Border Mask */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-[#264653] border-b-[3px] border-[#121212]">
          <img
            src={currentTeacher.coverImage}
            alt="Classroom backdrop"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Department badge top right */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-[#F1FAEE] neo-border-2 text-[#121212] text-xs font-black uppercase tracking-wider neo-shadow-sm">
              {currentTeacher.department}
            </span>
            <span className="px-3 py-1 bg-[#E63946] neo-border-2 text-white text-xs font-black uppercase tracking-wider neo-shadow-sm flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-white" />
              {currentTeacher.experienceYears} Years Guiding
            </span>
          </div>
        </div>

        {/* Profile Content Details */}
        <div className="px-6 sm:px-8 pb-8 -mt-20 sm:-mt-24 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-6">
            {/* Avatar & Title info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 neo-border bg-[#F1FAEE] neo-shadow overflow-hidden shrink-0">
                <img
                  src={currentTeacher.avatar}
                  alt={currentTeacher.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {currentTeacher.gift.giftUnlocked && (
                  <div className="absolute bottom-1 right-1 bg-[#E9C46A] border-2 border-[#121212] text-[#121212] px-1.5 py-0.5 text-[10px] font-black uppercase flex items-center gap-0.5">
                    <span>🏆</span> Honored
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight italic text-[#121212] font-sans">
                    {currentTeacher.name}
                  </h1>
                  <span className="px-2.5 py-0.5 bg-[#A8DADC] neo-border-2 text-[#121212] text-[10px] font-black uppercase tracking-wider">
                    Featured Mentor
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#E63946] font-black uppercase tracking-wide mt-1">
                  {currentTeacher.title}
                </p>
                <p className="text-xs text-[#121212]/80 mt-2 max-w-xl font-medium leading-relaxed">
                  {currentTeacher.bio}
                </p>
              </div>
            </div>

            {/* Quick Action Appreciation Buttons */}
            <div className="relative flex flex-wrap items-center gap-2.5 bg-[#F1FAEE] p-2 neo-border-2 self-stretch md:self-auto justify-center neo-shadow-sm">
              <button
                onClick={() => handleSendAppreciation('apple')}
                id="btn-send-apple"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E63946] hover:bg-[#d62839] text-white font-black uppercase text-xs neo-border-2 neo-shadow-sm transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <span>🍎</span>
                <span>Give Apple</span>
              </button>

              <button
                onClick={() => handleSendAppreciation('heart')}
                id="btn-send-highfive"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F4A261] hover:bg-[#e79250] text-[#121212] font-black uppercase text-xs neo-border-2 neo-shadow-sm transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <span>❤️</span>
                <span>High-Five</span>
              </button>

              <button
                onClick={() => onOpenCreateCard(currentTeacher.id)}
                id="btn-write-tribute-card"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#A8DADC] hover:bg-[#90c9cc] text-[#121212] font-black uppercase text-xs neo-border-2 neo-shadow-sm transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#121212]" />
                <span>Write Card</span>
              </button>

              {onOpenSendGiftModal && (
                <button
                  onClick={() => onOpenSendGiftModal(currentTeacher.id)}
                  id="btn-send-gift-action"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E9C46A] hover:bg-yellow-400 text-[#121212] font-black uppercase text-xs neo-border-2 neo-shadow-sm transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  <Gift className="w-3.5 h-3.5 text-[#121212]" />
                  <span>Send Gift 🎁</span>
                </button>
              )}

              {/* Floating reaction toast */}
              <AnimatePresence>
                {floatingReaction && (
                  <motion.div
                    key={floatingReaction.id}
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -30, scale: 1.05 }}
                    exit={{ opacity: 0, y: -45, scale: 0.9 }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#E9C46A] text-[#121212] neo-border-2 text-xs font-black uppercase tracking-wider px-3 py-1 neo-shadow-sm pointer-events-none whitespace-nowrap z-30"
                  >
                    {floatingReaction.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Inspirational Philosophy Quote */}
          <div className="p-4 bg-[#F1FAEE] neo-border-2 border-l-[6px] border-l-[#E63946] text-[#121212] text-sm font-serif italic mb-6 neo-shadow-sm">
            “{currentTeacher.quote}”
          </div>

          {/* Metrics & Impact Counter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-[#F1FAEE] neo-border-2 p-3.5 text-center neo-shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-[#121212] block font-sans">
                {currentTeacher.stats.applesReceived}
              </span>
              <span className="text-[10px] text-[#121212]/70 uppercase tracking-widest font-black">
                Apples Gifted
              </span>
            </div>

            <div className="bg-[#F1FAEE] neo-border-2 p-3.5 text-center neo-shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-[#E63946] block font-sans">
                {currentTeacher.stats.hearts}
              </span>
              <span className="text-[10px] text-[#121212]/70 uppercase tracking-widest font-black">
                Student Hearts
              </span>
            </div>

            <div className="bg-[#F1FAEE] neo-border-2 p-3.5 text-center neo-shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-[#264653] block font-sans">
                {currentTeacher.stats.thankYouNotes}
              </span>
              <span className="text-[10px] text-[#121212]/70 uppercase tracking-widest font-black">
                Wishes & Letters
              </span>
            </div>

            <div className="bg-[#F1FAEE] neo-border-2 p-3.5 text-center neo-shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-[#457B9D] block font-sans">
                {currentTeacher.stats.classesTaught}+
              </span>
              <span className="text-[10px] text-[#121212]/70 uppercase tracking-widest font-black">
                Classes Guided
              </span>
            </div>
          </div>

          {/* SURPRISE GIFT UNBOXING HERO CALLOUT (Geometric Balance Centerpiece) */}
          <div className="relative overflow-hidden bg-[#F4A261] neo-border neo-shadow p-6 md:p-8 text-[#121212] grid-paper">
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 text-center md:text-left">
                {/* Visual gift box icon */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsGiftModalOpen(true)}
                  className="w-20 h-20 sm:w-24 sm:h-24 neo-border bg-[#F1FAEE] neo-shadow-sm flex items-center justify-center text-4xl cursor-pointer shrink-0"
                >
                  {currentTeacher.gift.giftUnlocked ? '🏆' : '🎁'}
                </motion.div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 neo-border-2 bg-[#E63946] text-white text-[10px] font-black uppercase tracking-widest mb-1.5">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span>Special Surprise Dedication Area</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight italic text-[#121212]">
                    {currentTeacher.gift.giftUnlocked
                      ? `Unlocked: ${currentTeacher.gift.giftTitle}`
                      : `Surprise Dedication Box for ${currentTeacher.name}`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#121212]/80 max-w-lg mt-1 font-medium leading-relaxed">
                    {currentTeacher.gift.giftUnlocked
                      ? 'The honorary certificate & student tribute has been revealed! Click to revisit or print the tribute.'
                      : 'Students have prepared a wrapped surprise dedication with custom animations, personal messages, and honorary laurels.'}
                  </p>
                </div>
              </div>

              <button
                id="btn-open-surprise-gift"
                onClick={() => {
                  playSparkleChime();
                  setIsGiftModalOpen(true);
                }}
                className="bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-xs tracking-wider px-6 py-3.5 neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
              >
                <Gift className="w-4 h-4 text-white" />
                <span>
                  {currentTeacher.gift.giftUnlocked
                    ? 'View Unboxed Tribute'
                    : 'Reveal Surprise Gift!'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Grid: Accolades & Specific Wishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Accolades & Badges */}
        <section className="bg-[#E9C46A] neo-border neo-shadow p-6 text-[#121212] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-[#121212]">
            <Award className="w-5 h-5 text-[#121212]" />
            <h3 className="font-black uppercase tracking-tight text-lg italic text-[#121212]">
              Honors & Accolades
            </h3>
          </div>

          <div className="space-y-3">
            {currentTeacher.accolades.map((acc, idx) => (
              <div
                key={idx}
                className="bg-white neo-border-2 p-3.5 flex items-start gap-3 neo-shadow-sm"
              >
                <div className="p-2 neo-border-2 bg-[#F1FAEE] shrink-0">
                  {getAccoladeIcon(acc.icon)}
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#121212]">
                    {acc.title}
                  </h4>
                  <p className="text-xs text-[#121212]/70 mt-0.5 leading-relaxed font-medium">
                    {acc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="bg-[#F1FAEE] neo-border-2 p-4 text-center neo-shadow-sm">
              <span className="text-2xl mb-1 block">⭐</span>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-[#E63946]">
                Student Testimonial Highlight
              </h5>
              <p className="text-xs text-[#121212] italic mt-1.5 leading-relaxed font-medium">
                “{currentTeacher.gift.revealQuote}”
              </p>
            </div>
          </div>
        </section>

        {/* Right 2 Columns: Dedicated Wall of Wishes & Cards */}
        <section className="lg:col-span-2 bg-white neo-border neo-shadow p-6 text-[#121212] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#121212]">
            <div className="flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-[#E63946]" />
              <h3 className="font-black uppercase tracking-tight text-lg italic text-[#121212]">
                Wishes Wall for {currentTeacher.name}
              </h3>
              <span className="px-2 py-0.5 neo-border-2 bg-[#A8DADC] text-[#121212] text-[10px] font-black uppercase tracking-wider">
                {teacherCards.length + teacherShoutouts.length} notes
              </span>
            </div>

            <button
              onClick={() => onOpenCreateCard(currentTeacher.id)}
              id="btn-write-card-section"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E63946] hover:bg-[#d62839] text-white text-xs font-black uppercase tracking-wider neo-border-2 neo-shadow-sm transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
              <span>Write Card</span>
            </button>
          </div>

          {/* Cards & Shout-outs List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherCards.map((card) => (
              <div
                key={card.id}
                className="bg-[#F1FAEE] neo-border-2 p-4 flex flex-col justify-between neo-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#E63946] mb-1.5">
                    <span>{card.frontDesign}</span>
                    <span className="text-[#121212]/50 font-bold">{card.date}</span>
                  </div>
                  <h4 className="font-black uppercase tracking-tight text-[#121212] text-sm mb-2 group-hover:text-[#E63946] transition-colors">
                    {card.headline}
                  </h4>
                  <p className="text-xs text-[#121212]/80 leading-relaxed line-clamp-4 italic">
                    “{card.message}”
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-[#121212]/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-black text-[#121212] block uppercase text-[11px]">
                      {card.senderName}
                    </span>
                    <span className="text-[10px] font-bold text-[#121212]/60 uppercase">
                      {card.senderRole}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[#121212] text-xs font-black">
                    <span className="flex items-center gap-1 bg-white neo-border-2 px-1.5 py-0.5 text-[10px]">
                      ❤️ {card.reactions.love}
                    </span>
                    <span className="flex items-center gap-1 bg-white neo-border-2 px-1.5 py-0.5 text-[10px]">
                      🍎 {card.reactions.apple}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {teacherShoutouts.map((shout) => (
              <div
                key={shout.id}
                className="bg-[#A8DADC] neo-border-2 p-4 flex flex-col justify-between neo-shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 bg-white neo-border-2 text-[#121212] text-[10px] font-black uppercase tracking-wider">
                      {shout.tag}
                    </span>
                    <span className="text-[#121212]/60 text-[10px] font-bold">{shout.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#121212] leading-relaxed mb-3 font-semibold">
                    {shout.message}
                  </p>
                  {shout.photoUrl && (
                    <div className="neo-border-2 overflow-hidden h-28 w-full mb-2 bg-white">
                      <img
                        src={shout.photoUrl}
                        alt="Classroom moment"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t-2 border-[#121212]/15 flex items-center justify-between text-xs font-black">
                  <span className="text-[#121212] uppercase text-[11px]">
                    {shout.studentName} ({shout.gradeOrClass})
                  </span>
                  <span className="bg-white neo-border-2 px-1.5 py-0.5 text-[10px]">❤️ {shout.likes}</span>
                </div>
              </div>
            ))}
          </div>

          {teacherCards.length === 0 && teacherShoutouts.length === 0 && (
            <div className="text-center py-10 text-[#121212]/60 bg-[#F1FAEE] neo-border-2">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#121212]" />
              <p className="text-xs font-bold uppercase tracking-wider">Be the first to leave a heartfelt card for {currentTeacher.name}!</p>
            </div>
          )}
        </section>
      </div>

      {/* ================= STUDENT GIFTS & TRIBUTES SHOWCASE ================= */}
      <section className="bg-white neo-border neo-shadow p-6 md:p-8 text-[#121212]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#121212] mb-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 neo-border-2 bg-[#E9C46A] flex items-center justify-center text-xl neo-shadow-sm">
              🎁
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black uppercase tracking-tight text-xl italic font-sans text-[#121212]">
                  Student Gifts & Celebratory Tributes
                </h3>
                <span className="px-2 py-0.5 bg-[#E63946] text-white neo-border-2 text-[10px] font-black uppercase">
                  {teacherStudentGifts.length} Received
                </span>
              </div>
              <p className="text-xs text-[#121212]/70 font-medium mt-0.5">
                Personalized virtual gifts presented by students with custom celebratory reveal animations.
              </p>
            </div>
          </div>

          {onOpenSendGiftModal && (
            <button
              onClick={() => onOpenSendGiftModal(currentTeacher.id)}
              id="btn-send-gift-section"
              className="px-4 py-2.5 bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-xs tracking-wider neo-shadow transition-all cursor-pointer flex items-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
              <span>Present a Gift 🎁</span>
            </button>
          )}
        </div>

        {teacherStudentGifts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacherStudentGifts.map((gift) => {
              const animBadges: Record<string, { icon: string; name: string }> = {
                fireworks: { icon: '🎆', name: 'Fireworks' },
                balloons: { icon: '🎈', name: 'Balloons' },
                origami: { icon: '🕊️', name: 'Origami' },
                blossom: { icon: '🌸', name: 'Blossoms' },
                trophy: { icon: '🏆', name: 'Trophy Fanfare' },
                chalkboard: { icon: '✏️', name: 'Chalk Magic' },
              };
              const badge = animBadges[gift.animationType] || { icon: '✨', name: 'Celebration' };

              return (
                <div
                  key={gift.id}
                  className="bg-[#F1FAEE] neo-border-2 p-5 flex flex-col justify-between neo-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-10 h-10 neo-border-2 bg-white flex items-center justify-center text-2xl neo-shadow-sm">
                          {gift.giftIcon}
                        </span>
                        <div>
                          <h4 className="font-black uppercase tracking-tight text-xs text-[#121212]">
                            {gift.giftName}
                          </h4>
                          <span className="text-[10px] text-[#E63946] font-bold uppercase block">
                            Wrap: {gift.wrapStyle}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 bg-white neo-border-2 text-[10px] font-black uppercase tracking-wider text-[#121212] flex items-center gap-1">
                        <span>{badge.icon}</span>
                        <span>{badge.name}</span>
                      </span>
                    </div>

                    <p className="text-xs text-stone-900 italic font-serif leading-relaxed mb-4 bg-white neo-border-2 p-3 line-clamp-3">
                      “{gift.message}”
                    </p>
                  </div>

                  <div className="pt-3 border-t-2 border-[#121212]/15 flex items-center justify-between">
                    <div>
                      <span className="font-black text-[#121212] block uppercase text-[11px]">
                        From: {gift.studentName}
                      </span>
                      {gift.studentGroup && (
                        <span className="text-[10px] font-bold text-[#121212]/60 uppercase">
                          {gift.studentGroup}
                        </span>
                      )}
                    </div>

                    {onRevealStudentGift && (
                      <button
                        onClick={() => onRevealStudentGift(gift)}
                        className="px-3 py-1.5 bg-[#E9C46A] hover:bg-yellow-300 text-[#121212] font-black uppercase text-[11px] neo-border-2 neo-shadow-sm transition-all cursor-pointer flex items-center gap-1 active:translate-x-1 active:translate-y-1"
                      >
                        <Sparkles className="w-3 h-3 text-[#E63946]" />
                        <span>Reveal Animation</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#F1FAEE] neo-border-2 p-6">
            <span className="text-4xl block mb-2">🎁</span>
            <h4 className="font-black uppercase tracking-tight text-sm text-[#121212] mb-1">
              No Student Gifts Presented Yet
            </h4>
            <p className="text-xs text-[#121212]/70 max-w-md mx-auto mb-4 font-medium">
              Surprise {currentTeacher.name} with a personalized virtual gift like the Golden Apple or Cosmic Quill, complete with celebratory animations!
            </p>
            {onOpenSendGiftModal && (
              <button
                onClick={() => onOpenSendGiftModal(currentTeacher.id)}
                className="px-5 py-2 bg-[#E9C46A] hover:bg-yellow-300 text-[#121212] font-black uppercase text-xs neo-border-2 neo-shadow-sm transition-all cursor-pointer"
              >
                Present First Gift to {currentTeacher.name} 🎁
              </button>
            )}
          </div>
        )}
      </section>

      {/* Surprise Gift Reveal Modal */}
      <GiftSurpriseModal
        teacher={currentTeacher}
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        onGiftUnlocked={onGiftUnlocked}
      />
    </div>
  );
};
