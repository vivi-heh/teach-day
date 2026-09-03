import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Heart, BookOpen, Palette } from 'lucide-react';
import { Teacher, GreetingCard, CelebrationAnimationType } from '../../types';
import { playGiftRevealFanfare, playPopClick } from '../../utils/audio';

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  prefilledTeacherId?: string;
  onAddCard: (card: GreetingCard) => void;
}

export const CreateCardModal: React.FC<CreateCardModalProps> = ({
  isOpen,
  onClose,
  teachers,
  prefilledTeacherId,
  onAddCard,
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState(
    prefilledTeacherId || 'all'
  );
  const [senderName, setSenderName] = useState('A Grateful Student');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [senderRole, setSenderRole] = useState('Grateful Pupil');
  const [theme, setTheme] = useState<'golden' | 'chalkboard' | 'watercolor' | 'origami' | 'vintage'>('golden');
  const [animationType, setAnimationType] = useState<CelebrationAnimationType>('fireworks');
  const [headline, setHeadline] = useState('To the Mentors Who Light Our Way');
  const [message, setMessage] = useState('');
  const [quote, setQuote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    playGiftRevealFanfare();

    let teacherName = 'All Wonderful Educators';
    if (selectedTeacherId !== 'all') {
      const t = teachers.find((teach) => teach.id === selectedTeacherId);
      if (t) teacherName = t.name;
    }

    const frontDesignMap = {
      golden: '🌟 Golden Radiance of Knowledge',
      chalkboard: '📚 Classic Blackboard & Apple',
      watercolor: '🌸 Botanical Bloom of Gratitude',
      origami: '⚡ Modern Folded Origami Crane',
      vintage: '📜 Parchment of Timeless Wisdom',
    };

    const newCard: GreetingCard = {
      id: 'card-' + Date.now(),
      teacherId: selectedTeacherId,
      teacherName,
      senderName: senderName.trim(),
      senderRole: senderRole.trim() || 'Student',
      theme,
      headline: headline.trim() || 'Happy Teachers’ Day!',
      frontDesign: frontDesignMap[theme],
      message: message.trim(),
      favoriteQuote: quote.trim() || undefined,
      animationType,
      reactions: { love: 1, apple: 1, star: 1, respect: 1 },
      date: 'Today',
    };

    onAddCard(newCard);
    onClose();
  };

  const themeOptions = [
    { id: 'golden', name: 'Golden Foil', color: 'from-amber-400 to-yellow-600', border: 'border-amber-400', defaultAnim: 'trophy' },
    { id: 'chalkboard', name: 'Chalkboard', color: 'from-emerald-800 to-teal-950', border: 'border-emerald-500', defaultAnim: 'chalkboard' },
    { id: 'watercolor', name: 'Watercolor', color: 'from-rose-400 to-pink-600', border: 'border-rose-400', defaultAnim: 'blossom' },
    { id: 'origami', name: 'Origami Geometric', color: 'from-sky-500 to-indigo-600', border: 'border-sky-400', defaultAnim: 'origami' },
    { id: 'vintage', name: 'Vintage Parchment', color: 'from-stone-700 to-stone-900', border: 'border-amber-600', defaultAnim: 'balloons' },
  ];

  const animationOptions: { id: CelebrationAnimationType; name: string; icon: string; desc: string }[] = [
    { id: 'fireworks', name: 'Fireworks', icon: '🎆', desc: 'Starry Rocket Bursts' },
    { id: 'balloons', name: 'Balloons', icon: '🎈', desc: 'Floating Lanterns & Balloons' },
    { id: 'origami', name: 'Origami Cranes', icon: '🕊️', desc: 'Peace Cranes in Flight' },
    { id: 'blossom', name: 'Floral Petals', icon: '🌸', desc: 'Swirling Blossom Breeze' },
    { id: 'trophy', name: 'Trophy Fanfare', icon: '🏆', desc: 'Confetti Cannons Blast' },
    { id: 'chalkboard', name: 'Chalk Sparks', icon: '✏️', desc: 'Wisdom Equations & Stars' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-white neo-border neo-shadow-lg text-[#121212] overflow-hidden my-8"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#121212] bg-[#F1FAEE]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#E63946]" />
            <h3 className="font-black uppercase tracking-tight italic font-sans text-lg text-[#121212]">
              Craft a Teachers’ Day Greeting Card
            </h3>
          </div>
          <button
            onClick={onClose}
            id="btn-close-create-card-modal"
            className="p-1 bg-white neo-border-2 text-[#121212] hover:bg-[#E63946] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
              Select Recipient Educator *
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
            >
              <option value="all">🌟 All Teachers & Faculty (General Card)</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Palette Picker */}
          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-2">
              Select Card Artistic Cover Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {themeOptions.map((th) => (
                <button
                  type="button"
                  key={th.id}
                  onClick={() => {
                    playPopClick();
                    setTheme(th.id as any);
                  }}
                  className={`p-2.5 neo-border-2 text-xs font-black uppercase flex items-center gap-2 transition-all cursor-pointer ${
                    theme === th.id
                      ? 'bg-[#E9C46A] neo-shadow-sm text-[#121212]'
                      : 'bg-white hover:bg-[#F1FAEE] text-[#121212]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 neo-border-2 bg-gradient-to-tr ${th.color} shrink-0`} />
                  <span className="truncate">{th.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Celebratory Reveal Animation Picker */}
          <div className="bg-[#F1FAEE] neo-border-2 p-3.5 neo-shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black uppercase text-[#121212] tracking-wider">
                🌟 Choose Celebratory Reveal Animation *
              </label>
              <span className="text-[10px] font-black uppercase text-[#E63946]">
                Plays Live Upon Reveal!
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {animationOptions.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => {
                    playPopClick();
                    setAnimationType(a.id);
                  }}
                  className={`p-2 neo-border-2 text-left transition-all cursor-pointer ${
                    animationType === a.id
                      ? 'bg-[#E9C46A] neo-shadow-sm text-[#121212]'
                      : 'bg-white hover:bg-[#FDFCFB] text-[#121212]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{a.icon}</span>
                    <span className="text-xs font-black uppercase tracking-tight">{a.name}</span>
                  </div>
                  <span className="text-[9px] text-[#121212]/70 block mt-0.5 font-medium">
                    {a.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-black uppercase text-[#121212] tracking-wider">
                  Student Name *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    playPopClick();
                    if (!isAnonymous) {
                      setSenderName('A Grateful Student');
                      setIsAnonymous(true);
                    } else {
                      setSenderName('');
                      setIsAnonymous(false);
                    }
                  }}
                  className={`text-[10px] font-black uppercase px-2 py-0.5 neo-border-2 transition-all cursor-pointer ${
                    isAnonymous
                      ? 'bg-[#E9C46A] text-[#121212]'
                      : 'bg-white hover:bg-[#F1FAEE] text-[#121212]/70'
                  }`}
                >
                  {isAnonymous ? '✓ Posting Anonymously' : 'Set Anonymous'}
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. A Grateful Student (Anonymous)"
                value={senderName}
                onChange={(e) => {
                  setSenderName(e.target.value);
                  setIsAnonymous(e.target.value.toLowerCase().includes('anonymous') || e.target.value.toLowerCase().includes('grateful'));
                }}
                className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
                Class / Student Title
              </label>
              <input
                type="text"
                placeholder="e.g. Grateful Pupil / Class of 2025"
                value={senderRole}
                onChange={(e) => setSenderRole(e.target.value)}
                className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
              Card Headline / Title
            </label>
            <input
              type="text"
              placeholder="e.g. To the Teacher Who Inspired Us Most"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
              Your Heartfelt Message *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Write your words of gratitude, favorite classroom memories, or how this educator changed your perspective..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
              Optional Favorite Quote or Memory
            </label>
            <input
              type="text"
              placeholder="e.g. “A teacher affects eternity; he can never tell where his influence stops.”"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F1FAEE] neo-border-2 text-[#121212] hover:bg-white text-xs font-black uppercase transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-publish-greeting-card"
              className="px-5 py-2.5 bg-[#121212] hover:bg-stone-900 text-white text-xs font-black uppercase neo-shadow transition-all cursor-pointer flex items-center gap-1.5 hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
              <span>Publish Card to Gallery</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
