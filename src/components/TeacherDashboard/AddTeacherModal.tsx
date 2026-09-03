import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, UserPlus, Sparkles, Award } from 'lucide-react';
import { Teacher } from '../../types';
import { playPopClick, playGiftRevealFanfare } from '../../utils/audio';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeacher: (teacher: Teacher) => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  onClose,
  onAddTeacher,
}) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Science & Math');
  const [title, setTitle] = useState('');
  const [experience, setExperience] = useState(8);
  const [quote, setQuote] = useState('');
  const [bio, setBio] = useState('');
  const [giftTitle, setGiftTitle] = useState('Master Mentor Laureate');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playGiftRevealFanfare();

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

    const newTeacher: Teacher = {
      id,
      name: name.trim(),
      title: title.trim() || `Mentor of ${department}`,
      department,
      avatar: `https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80`,
      coverImage: `https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80`,
      experienceYears: Number(experience) || 5,
      quote: quote.trim() || 'Teaching is the profession that creates all other professions.',
      bio: bio.trim() || `Dedicated educator in ${department} dedicated to inspiring curious minds.`,
      accolades: [
        {
          title: 'Heart of Wisdom Award',
          description: 'Recognized for unwavering encouragement and passion for students.',
          icon: 'Heart',
        },
        {
          title: 'Curiosity Catalyst',
          description: 'Sparking critical thinking and joyful exploration every day.',
          icon: 'Sparkles',
        },
      ],
      stats: {
        applesReceived: 10,
        thankYouNotes: 1,
        hearts: 25,
        classesTaught: 300,
      },
      gift: {
        giftType: 'Golden Torch of Knowledge',
        giftTitle: giftTitle.trim() || 'Master Mentor Laureate',
        badgeName: 'Exemplary Educator',
        revealQuote: `To ${name}, for guiding every student toward their brightest future!`,
        studentMessage: `Dear ${name}, thank you for your countless hours of preparation, endless patience, and steady encouragement. Happy Teachers’ Day!`,
        virtualTrophy: 'Trophy',
        giftUnlocked: false,
      },
    };

    onAddTeacher(newTeacher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white neo-border neo-shadow-lg text-[#121212] overflow-hidden my-8"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#121212] bg-[#F1FAEE]">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#E63946]" />
            <h3 className="font-sans font-black uppercase text-base tracking-tight text-[#121212] heading-pop">
              Add Educator / Mentor Role
            </h3>
          </div>
          <button
            onClick={onClose}
            id="btn-close-add-educator-modal"
            className="p-1 hover:bg-[#E63946] hover:text-white neo-border-2 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black text-[#121212] uppercase tracking-wider mb-1">
              Mentor Role / Educator Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mathematics & Logical Reasoning Mentor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-[#121212] uppercase tracking-wider mb-1">
                Department / Subject Field
              </label>
              <input
                type="text"
                placeholder="e.g. Pure Mathematics & Logic"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#121212] uppercase tracking-wider mb-1">
                Years Guiding Minds
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#121212] uppercase tracking-wider mb-1">
              Honorary Designation
            </label>
            <input
              type="text"
              placeholder="e.g. Department Chair & Senior Academic Guide"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#121212] uppercase tracking-wider mb-1">
              Inspiring Mentorship Philosophy / Quote
            </label>
            <input
              type="text"
              placeholder="e.g. Clear thinking and patience turn the hardest puzzles into joyous triumphs."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#121212] uppercase tracking-wider mb-1">
              Surprise Gift Award Title
            </label>
            <input
              type="text"
              placeholder="e.g. Master Mentor Laureate"
              value={giftTitle}
              onChange={(e) => setGiftTitle(e.target.value)}
              className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F1FAEE] hover:bg-stone-200 text-[#121212] neo-border-2 text-xs font-black uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-confirm-add-teacher"
              className="px-5 py-2 bg-[#E9C46A] hover:bg-yellow-400 text-[#121212] neo-border-2 neo-shadow-sm text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
              <span>Add Mentor Tribute</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
