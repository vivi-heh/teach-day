import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Gift, Sparkles, Award, Heart } from 'lucide-react';
import { Teacher, StudentGift, CelebrationAnimationType } from '../../types';
import { playPopClick, playSparkleChime } from '../../utils/audio';

interface SendGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  prefilledTeacherId?: string;
  onSendGift: (gift: StudentGift) => void;
}

export const VIRTUAL_GIFTS = [
  {
    id: 'golden-apple',
    name: 'Golden Apple of Knowledge',
    icon: '🍎',
    desc: 'Symbolizing nourishing wisdom, patience, and eternal classroom gratitude.',
  },
  {
    id: 'cosmic-quill',
    name: 'Cosmic Library Quill & Ink',
    icon: '📚',
    desc: 'For inspiring deep thought, eloquent words, and timeless life lessons.',
  },
  {
    id: 'coffee-hamper',
    name: 'Master Educator Coffee & Cocoa Hamper',
    icon: '☕',
    desc: 'Warm comforting brew for early lesson plans and dedicated grading nights.',
  },
  {
    id: 'gratitude-bouquet',
    name: 'Bouquet of Sunflowers & Gratitude',
    icon: '💐',
    desc: 'A radiant burst of fresh blooms to brighten every step of your mentoring journey.',
  },
  {
    id: 'explorer-compass',
    name: 'Grand Explorer Compass & Astrolabe',
    icon: '🔬',
    desc: 'For navigating uncharted ideas and guiding young minds to their true north.',
  },
  {
    id: 'artisan-palette',
    name: 'Master Artisan Palette & Golden Brush',
    icon: '🎨',
    desc: 'Honoring the creative spark and colorful imagination you bring to school.',
  },
  {
    id: 'star-trophy',
    name: 'Order of the Guiding Star Trophy',
    icon: '🏆',
    desc: 'The highest honorary tribute bestowed by students for lifetime inspiration.',
  },
  {
    id: 'origami-cranes',
    name: '1,000 Origami Cranes of Peace & Joy',
    icon: '🕊️',
    desc: 'A thousand folded paper cranes carrying student wishes for health and happiness.',
  },
];

export const SendGiftModal: React.FC<SendGiftModalProps> = ({
  isOpen,
  onClose,
  teachers,
  prefilledTeacherId,
  onSendGift,
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    prefilledTeacherId || teachers[0]?.id || ''
  );
  const [selectedGiftId, setSelectedGiftId] = useState<string>(VIRTUAL_GIFTS[0].id);
  const [wrapStyle, setWrapStyle] = useState<StudentGift['wrapStyle']>('crimson');
  const [animationType, setAnimationType] = useState<CelebrationAnimationType>('fireworks');
  const [studentName, setStudentName] = useState('A Grateful Student');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [studentGroup, setStudentGroup] = useState('Pupil');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
  const chosenGift = VIRTUAL_GIFTS.find((g) => g.id === selectedGiftId) || VIRTUAL_GIFTS[0];

  const wrapOptions: { id: StudentGift['wrapStyle']; name: string; color: string; border: string }[] = [
    { id: 'crimson', name: 'Crimson Neo-Ribbon', color: 'bg-[#E63946]', border: 'border-[#121212]' },
    { id: 'gold', name: 'Royal Gold Seal', color: 'bg-[#E9C46A]', border: 'border-[#121212]' },
    { id: 'emerald', name: 'Forest Sage Bento', color: 'bg-[#2A9D8F]', border: 'border-[#121212]' },
    { id: 'bento', name: 'Warm Ochre Wrap', color: 'bg-[#F4A261]', border: 'border-[#121212]' },
    { id: 'midnight', name: 'Starlight Slate', color: 'bg-[#264653]', border: 'border-[#121212]' },
  ];

  const animationOptions: { id: CelebrationAnimationType; name: string; icon: string; desc: string }[] = [
    { id: 'fireworks', name: 'Fireworks Burst', icon: '🎆', desc: 'Starry Rocket Flashes' },
    { id: 'balloons', name: 'Sky Balloons & Lanterns', icon: '🎈', desc: 'Buoyant Floating Joy' },
    { id: 'origami', name: 'Peace Cranes Soar', icon: '🕊️', desc: 'Graceful Paper Flight' },
    { id: 'blossom', name: 'Floral Petal Bloom', icon: '🌸', desc: 'Sakura & Rose Cascade' },
    { id: 'trophy', name: 'Trophy Cannon Fanfare', icon: '🏆', desc: 'Golden Streamer Blast' },
    { id: 'chalkboard', name: 'Chalkboard Wisdom Magic', icon: '✏️', desc: 'Glowing Chalk Sparks' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setError('Please enter your name or student group.');
      return;
    }
    if (!message.trim()) {
      setError('Please write a heartfelt gift dedication message.');
      return;
    }

    playSparkleChime();

    const newGift: StudentGift = {
      id: 'gift-' + Date.now(),
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name,
      studentName: studentName.trim(),
      studentGroup: studentGroup.trim() || undefined,
      giftId: chosenGift.id,
      giftName: chosenGift.name,
      giftIcon: chosenGift.icon,
      giftDescription: chosenGift.desc,
      wrapStyle,
      animationType,
      message: message.trim(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      unwrapped: true,
      reactionsCount: 1,
    };

    onSendGift(newGift);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white neo-border neo-shadow-lg text-[#121212] overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#121212] bg-[#F1FAEE]">
          <div className="flex items-center gap-2">
            <span className="neo-border-2 bg-[#E9C46A] p-1 text-sm">🎁</span>
            <h3 className="font-black uppercase tracking-tight italic font-sans text-lg text-[#121212]">
              Send a Surprise Gift to an Educator
            </h3>
          </div>
          <button
            onClick={onClose}
            id="btn-close-send-gift-modal"
            className="p-1 bg-white neo-border-2 text-[#121212] hover:bg-[#E63946] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-[#E63946]/10 neo-border-2 border-[#E63946] text-[#E63946] text-xs font-black uppercase">
              ⚠️ {error}
            </div>
          )}

          {/* Teacher Selector */}
          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
              Select Recipient Educator *
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department} - {t.title})
                </option>
              ))}
            </select>
          </div>

          {/* Gift Catalog Choice */}
          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-2">
              Choose Virtual Gift Trophy *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {VIRTUAL_GIFTS.map((g) => {
                const isSelected = selectedGiftId === g.id;
                return (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => {
                      playPopClick();
                      setSelectedGiftId(g.id);
                    }}
                    className={`p-2.5 neo-border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#E9C46A] neo-shadow-sm scale-[1.02] text-[#121212]'
                        : 'bg-white hover:bg-[#F1FAEE] text-[#121212]'
                    }`}
                  >
                    <div>
                      <span className="text-2xl block mb-1">{g.icon}</span>
                      <span className="text-xs font-black uppercase tracking-tight block leading-tight">
                        {g.name}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#121212]/70 line-clamp-2 mt-1 leading-snug font-medium">
                      {g.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wrapping Style */}
          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-2">
              Select Gift Box Presentation Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {wrapOptions.map((w) => (
                <button
                  type="button"
                  key={w.id}
                  onClick={() => {
                    playPopClick();
                    setWrapStyle(w.id);
                  }}
                  className={`p-2 neo-border-2 text-xs font-black uppercase flex items-center gap-2 transition-all cursor-pointer ${
                    wrapStyle === w.id
                      ? 'bg-[#E9C46A] neo-shadow-sm text-[#121212]'
                      : 'bg-white hover:bg-[#F1FAEE] text-[#121212]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 neo-border-2 ${w.color} shrink-0`} />
                  <span className="truncate text-[10px]">{w.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Celebratory Reveal Animation Picker */}
          <div className="bg-[#F1FAEE] neo-border-2 p-3.5 neo-shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black uppercase text-[#121212] tracking-wider">
                🌟 Choose Unique Celebratory Reveal Animation *
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
                  className={`p-2.5 neo-border-2 text-left transition-all cursor-pointer ${
                    animationType === a.id
                      ? 'bg-[#E9C46A] neo-shadow-sm text-[#121212]'
                      : 'bg-white hover:bg-[#FDFCFB] text-[#121212]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{a.icon}</span>
                    <span className="text-xs font-black uppercase tracking-tight">{a.name}</span>
                  </div>
                  <span className="text-[9px] text-[#121212]/70 block mt-0.5 font-medium">
                    {a.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Student Sender Details */}
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
                      setStudentName('A Grateful Student');
                      setIsAnonymous(true);
                    } else {
                      setStudentName('');
                      setIsAnonymous(false);
                    }
                  }}
                  className={`text-[10px] font-black uppercase px-2 py-0.5 neo-border-2 transition-all cursor-pointer ${
                    isAnonymous
                      ? 'bg-[#E9C46A] text-[#121212]'
                      : 'bg-white hover:bg-[#F1FAEE] text-[#121212]/70'
                  }`}
                >
                  {isAnonymous ? '✓ Anonymous' : 'Set Anonymous'}
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. A Grateful Student (Anonymous)"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  setIsAnonymous(e.target.value.toLowerCase().includes('anonymous') || e.target.value.toLowerCase().includes('grateful'));
                }}
                className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
                Class / Student Group
              </label>
              <input
                type="text"
                placeholder="e.g. Grateful Pupil / Science Club"
                value={studentGroup}
                onChange={(e) => setStudentGroup(e.target.value)}
                className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Heartfelt Dedication Message */}
          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
              Personal Gift Dedication Note *
            </label>
            <textarea
              rows={3}
              placeholder="Why are you presenting this gift? Share an unforgettable moment, words of appreciation, or how this educator inspired you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#121212]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F1FAEE] neo-border-2 text-[#121212] hover:bg-white text-xs font-black uppercase transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-confirm-send-gift"
              className="px-6 py-2.5 bg-[#121212] hover:bg-stone-900 text-white text-xs font-black uppercase neo-shadow transition-all cursor-pointer flex items-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              <Sparkles className="w-4 h-4 text-[#E9C46A]" />
              <span>Present Gift & Play Reveal!</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
