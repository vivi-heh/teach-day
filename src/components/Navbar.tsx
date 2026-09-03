import React from 'react';
import { Sparkles, Volume2, VolumeX, BookOpen, Gamepad2, Heart, PlusCircle, Home, MessageSquareHeart, GraduationCap, Award, Laptop } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playGiftRevealFanfare, toggleSound } from '../utils/audio';

interface NavbarProps {
  activeTab: 'dashboard' | 'cards' | 'games' | 'memories';
  setActiveTab: (tab: 'dashboard' | 'cards' | 'games' | 'memories') => void;
  onOpenCreateCard: () => void;
  onOpenSubmitShoutout: () => void;
  onOpenHappyTeachersDayModal?: () => void;
  soundActive: boolean;
  setSoundActive: (active: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateCard,
  onOpenSubmitShoutout,
  onOpenHappyTeachersDayModal,
  soundActive,
  setSoundActive,
}) => {
  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundActive(newState);
  };

  const triggerGlobalConfetti = () => {
    playGiftRevealFanfare();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#E63946', '#E9C46A', '#2A9D8F', '#F4A261', '#1D3557'],
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCFB] text-[#121212] border-b-[3px] border-[#121212]">
      {/* Top celebratory banner ribbon */}
      <div className="bg-[#E63946] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider py-1 sm:py-1.5 px-2 sm:px-4 text-center flex items-center justify-center gap-2 sm:gap-3 border-b-2 border-[#121212]">
        <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
        <span className="font-extrabold tracking-wide truncate sm:overflow-visible">
          Happy Teachers’ Day 2026 • Honoring Every Mentor
        </span>
        <span className="hidden sm:inline text-white/60">|</span>
        {onOpenHappyTeachersDayModal && (
          <button
            onClick={onOpenHappyTeachersDayModal}
            id="btn-open-teachers-day-intro-ribbon"
            className="hidden sm:inline-flex items-center gap-1 font-black underline underline-offset-2 hover:text-[#E9C46A] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Grand Tribute</span>
          </button>
        )}
        <span className="hidden sm:inline text-white/60">|</span>
        <button
          onClick={triggerGlobalConfetti}
          id="btn-celebrate-ribbon"
          className="hidden sm:inline-flex items-center gap-1 underline underline-offset-2 hover:text-[#E9C46A] transition-colors cursor-pointer font-black"
        >
          <Sparkles className="w-3.5 h-3.5" /> Launch Confetti
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Portal title */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none min-w-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-9 h-9 sm:w-12 sm:h-12 neo-border bg-[#E9C46A] neo-shadow-sm flex items-center justify-center font-black shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[#121212]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-2xl font-black uppercase tracking-tight leading-none italic font-sans text-[#121212] whitespace-nowrap">
                  TEACHERS’ <span className="text-[#E63946]">DAY</span>
                </span>
                <span className="neo-border-2 bg-[#E9C46A] text-[#121212] px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  2026
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#121212]/80 mt-0.5 hidden sm:block truncate">
                Universal Tribute // Wishes • Gratitude Letters • Coding & STEM • Games
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 bg-[#F1FAEE] p-1.5 neo-border shrink-0">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#E9C46A] text-[#121212] neo-border-2 neo-shadow-sm'
                  : 'text-[#121212] hover:bg-white border-2 border-transparent'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Tribute Home</span>
            </button>

            <button
              id="nav-tab-cards"
              onClick={() => setActiveTab('cards')}
              className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-[#E9C46A] text-[#121212] neo-border-2 neo-shadow-sm'
                  : 'text-[#121212] hover:bg-white border-2 border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Wishes & Cards</span>
            </button>

            <button
              id="nav-tab-memories"
              onClick={() => setActiveTab('memories')}
              className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'memories'
                  ? 'bg-[#E9C46A] text-[#121212] neo-border-2 neo-shadow-sm'
                  : 'text-[#121212] hover:bg-white border-2 border-transparent'
              }`}
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>Gratitude Notes</span>
            </button>

            <button
              id="nav-tab-games"
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'games'
                  ? 'bg-[#E9C46A] text-[#121212] neo-border-2 neo-shadow-sm'
                  : 'text-[#121212] hover:bg-white border-2 border-transparent'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Trivia & Games</span>
            </button>
          </nav>

          {/* Quick Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Pop-out Tribute Button */}
            {onOpenHappyTeachersDayModal && (
              <button
                id="btn-navbar-happy-day"
                onClick={onOpenHappyTeachersDayModal}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#E9C46A] hover:bg-[#ffd666] text-[#121212] text-xs font-black uppercase tracking-wider neo-border-2 neo-shadow-sm transition-all cursor-pointer active:translate-y-[1px] min-h-[40px] sm:min-h-[44px]"
              >
                <Award className="w-3.5 h-3.5 text-[#E63946]" />
                <span className="hidden sm:inline">Tribute</span>
              </button>
            )}

            {/* Sound toggle button */}
            <button
              id="btn-sound-toggle"
              onClick={handleSoundToggle}
              title={soundActive ? 'Sound Effects Enabled' : 'Sound Muted'}
              className="p-2 bg-[#F1FAEE] hover:bg-white text-[#121212] neo-border-2 neo-shadow-sm transition-all cursor-pointer active:translate-y-[1px] min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
            >
              {soundActive ? <Volume2 className="w-4 h-4 text-[#E63946]" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>

            {/* Confetti celebration launcher */}
            <button
              id="btn-trigger-celebration"
              onClick={triggerGlobalConfetti}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 bg-[#A8DADC] hover:bg-[#90c9cc] text-[#121212] text-xs font-black uppercase tracking-wider neo-border-2 neo-shadow-sm transition-all cursor-pointer active:translate-y-[1px] min-h-[44px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#121212]" />
              <span>Confetti</span>
            </button>

            {/* Write a Wish button */}
            <button
              id="btn-navbar-write-wish"
              onClick={onOpenCreateCard}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-[#E63946] hover:bg-[#d62839] text-white text-xs font-black uppercase tracking-wider neo-border-2 neo-shadow-sm transition-all cursor-pointer active:translate-y-[1px] min-h-[40px] sm:min-h-[44px]"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span className="hidden sm:inline">Write a Wish</span>
              <span className="sm:hidden text-[11px]">Wish</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t-2 border-[#121212] no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2 font-black uppercase tracking-wider whitespace-nowrap cursor-pointer shrink-0 min-h-[42px] ${
              activeTab === 'dashboard'
                ? 'bg-[#E9C46A] text-[#121212] neo-border-2 neo-shadow-sm'
                : 'text-[#121212] bg-[#F1FAEE] border-2 border-transparent'
            }`}
          >
            <Home className="w-3.5 h-3.5" /> Home
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-1.5 px-3 py-2 font-black uppercase tracking-wider whitespace-nowrap cursor-pointer shrink-0 min-h-[42px] ${
              activeTab === 'cards'
                ? 'bg-[#E9C46A] text-[#121212] neo-border-2 neo-shadow-sm'
                : 'text-[#121212] bg-[#F1FAEE] border-2 border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Wishes & Cards
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`flex items-center gap-1.5 px-3 py-2 font-black uppercase tracking-wider whitespace-nowrap cursor-pointer shrink-0 min-h-[42px] ${
              activeTab === 'memories'
                ? 'bg-[#E9C46A] text-[#121212] neo-border-2 neo-shadow-sm'
                : 'text-[#121212] bg-[#F1FAEE] border-2 border-transparent'
            }`}
          >
            <MessageSquareHeart className="w-3.5 h-3.5" /> Gratitude Notes
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-1.5 px-3 py-2 font-black uppercase tracking-wider whitespace-nowrap cursor-pointer shrink-0 min-h-[42px] ${
              activeTab === 'games'
                ? 'bg-[#E9C46A] text-[#121212] neo-border-2 neo-shadow-sm'
                : 'text-[#121212] bg-[#F1FAEE] border-2 border-transparent'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" /> Trivia & Games
          </button>
        </div>
      </div>
    </header>
  );
};
