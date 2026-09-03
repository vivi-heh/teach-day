import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Heart, MessageSquareHeart } from 'lucide-react';
import { Teacher, Shoutout, CelebrationAnimationType } from '../../types';
import { playGiftRevealFanfare, playPopClick } from '../../utils/audio';

interface SubmitShoutoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  onSubmit: (shoutout: Shoutout) => void;
}

export const SubmitShoutoutModal: React.FC<SubmitShoutoutModalProps> = ({
  isOpen,
  onClose,
  teachers,
  onSubmit,
}) => {
  const [studentName, setStudentName] = useState('A Grateful Student');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [gradeOrClass, setGradeOrClass] = useState('Grateful Pupil');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || 'all');
  const [message, setMessage] = useState('');
  const [tag, setTag] = useState<Shoutout['tag']>('Heartfelt');
  const [animationType, setAnimationType] = useState<CelebrationAnimationType>('fireworks');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !message.trim()) return;

    playGiftRevealFanfare();

    let teacherName = 'All Wonderful Teachers & Mentors';
    if (teacherId !== 'all') {
      const selected = teachers.find((t) => t.id === teacherId);
      if (selected) teacherName = selected.name;
    }

    const newShoutout: Shoutout = {
      id: 'shout-' + Date.now(),
      studentName: studentName.trim(),
      gradeOrClass: gradeOrClass.trim() || 'Student',
      teacherId,
      teacherName,
      message: message.trim(),
      tag,
      animationType,
      timestamp: 'Just now',
      likes: 1,
    };

    onSubmit(newShoutout);
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
            <MessageSquareHeart className="w-5 h-5 text-[#E63946]" />
            <h3 className="font-black uppercase tracking-tight italic font-sans text-lg text-[#121212]">
              Post a Note of Gratitude
            </h3>
          </div>
          <button
            onClick={onClose}
            id="btn-close-shoutout-modal"
            className="p-1 bg-white neo-border-2 text-[#121212] hover:bg-[#E63946] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                required
                placeholder="e.g. A Grateful Student (Anonymous)"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  setIsAnonymous(
                    e.target.value.toLowerCase().includes('anonymous') ||
                      e.target.value.toLowerCase().includes('grateful')
                  );
                }}
                className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
                Class / Subject Group
              </label>
              <input
                type="text"
                placeholder="e.g. Pupil / Class of 2026"
                value={gradeOrClass}
                onChange={(e) => setGradeOrClass(e.target.value)}
                className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
              Recipient Teacher
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none"
            >
              <option value="all">🌟 All Educators (Universal Tribute)</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
              Note Category
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Heartfelt', 'Inspirational', 'Funny', 'Memorable', 'Life Lesson'] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => {
                    playPopClick();
                    setTag(t);
                  }}
                  className={`px-3 py-1.5 neo-border-2 text-xs font-black uppercase transition-all cursor-pointer ${
                    tag === t
                      ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                      : 'bg-white text-[#121212] hover:bg-[#F1FAEE]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#121212] tracking-wider mb-1">
              Your Message of Gratitude *
            </label>
            <textarea
              required
              rows={4}
              placeholder="What makes your teacher unforgettable? A moment of patient encouragement, an inspiring class, or a piece of wisdom that stayed with you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 neo-border-2 bg-[#F1FAEE] text-xs font-bold text-[#121212] focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="btn-submit-gratitude-form"
              className="w-full py-3 bg-[#E63946] hover:bg-[#d62839] text-white font-black uppercase text-xs tracking-wider neo-border neo-shadow cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Publish Note to Gratitude Wall</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
