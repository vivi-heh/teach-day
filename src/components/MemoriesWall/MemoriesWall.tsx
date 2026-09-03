import React, { useState } from 'react';
import { Heart, PlusCircle, Sparkles, Filter, Search, MessageSquareHeart, Quote } from 'lucide-react';
import { Shoutout, Teacher } from '../../types';
import { playPopClick } from '../../utils/audio';

interface MemoriesWallProps {
  shoutouts: Shoutout[];
  teachers: Teacher[];
  onOpenSubmitShoutout: () => void;
  onLikeShoutout: (shoutoutId: string) => void;
}

export const MemoriesWall: React.FC<MemoriesWallProps> = ({
  shoutouts,
  teachers,
  onOpenSubmitShoutout,
  onLikeShoutout,
}) => {
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredShoutouts = shoutouts.filter((s) => {
    const matchesTag = selectedTagFilter === 'all' || s.tag === selectedTagFilter;
    const matchesSearch =
      s.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const getTagBadgeStyle = (tag: Shoutout['tag']) => {
    switch (tag) {
      case 'Heartfelt':
        return 'bg-[#FFF3B0] text-[#121212]';
      case 'Inspirational':
        return 'bg-[#FFD166] text-[#121212]';
      case 'Life Lesson':
        return 'bg-[#A8DADC] text-[#121212]';
      case 'Funny':
        return 'bg-[#F4A261] text-[#121212]';
      case 'Memorable':
      default:
        return 'bg-[#E9C46A] text-[#121212]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#2A9D8F] neo-border neo-shadow p-6 md:p-10 text-white grid-paper">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E63946] text-white text-[10px] font-black uppercase tracking-wider neo-border-2 neo-shadow-sm">
            <MessageSquareHeart className="w-3.5 h-3.5 text-white" />
            <span>Teachers’ Day 2026 Gratitude Wall</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight italic font-sans text-white leading-tight">
            Notes of Gratitude from Grateful Hearts
          </h1>
          <p className="text-sm sm:text-base text-stone-100 leading-relaxed font-medium">
            Real student notes, life lessons, and warm memories honoring every teacher who made a lasting difference.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenSubmitShoutout}
              id="btn-submit-gratitude-note"
              className="px-5 py-2.5 bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-xs tracking-wider neo-shadow transition-all cursor-pointer flex items-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              <PlusCircle className="w-4 h-4 text-[#E9C46A]" />
              <span>Post Your Note of Gratitude</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white neo-border neo-shadow p-4 text-[#121212]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <Filter className="w-4 h-4 text-[#E63946] shrink-0 ml-1" />
          <button
            onClick={() => setSelectedTagFilter('all')}
            className={`px-3 py-1.5 neo-border-2 font-black uppercase whitespace-nowrap transition-all cursor-pointer ${
              selectedTagFilter === 'all'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            All Notes ({shoutouts.length})
          </button>
          <button
            onClick={() => setSelectedTagFilter('Heartfelt')}
            className={`px-3 py-1.5 neo-border-2 font-black uppercase whitespace-nowrap transition-all cursor-pointer ${
              selectedTagFilter === 'Heartfelt'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            ❤️ Heartfelt
          </button>
          <button
            onClick={() => setSelectedTagFilter('Inspirational')}
            className={`px-3 py-1.5 neo-border-2 font-black uppercase whitespace-nowrap transition-all cursor-pointer ${
              selectedTagFilter === 'Inspirational'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            🌟 Inspirational
          </button>
          <button
            onClick={() => setSelectedTagFilter('Life Lesson')}
            className={`px-3 py-1.5 neo-border-2 font-black uppercase whitespace-nowrap transition-all cursor-pointer ${
              selectedTagFilter === 'Life Lesson'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            🌱 Life Lesson
          </button>
          <button
            onClick={() => setSelectedTagFilter('Funny')}
            className={`px-3 py-1.5 neo-border-2 font-black uppercase whitespace-nowrap transition-all cursor-pointer ${
              selectedTagFilter === 'Funny'
                ? 'bg-[#E9C46A] text-[#121212] neo-shadow-sm'
                : 'bg-[#F1FAEE] text-[#121212] hover:bg-white'
            }`}
          >
            😄 Humorous
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#121212]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or messages..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F1FAEE] neo-border-2 text-xs font-bold text-[#121212] placeholder:text-stone-400 focus:outline-none focus:bg-white transition-colors"
          />
        </div>
      </section>

      {/* Grid of Gratitude Notes (No useless images!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShoutouts.map((note) => (
          <div
            key={note.id}
            className="bg-white neo-border neo-shadow p-6 flex flex-col justify-between space-y-4 text-[#121212]"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`px-2.5 py-1 ${getTagBadgeStyle(note.tag)} neo-border-2 text-[10px] font-black uppercase tracking-wider`}>
                  {note.tag}
                </span>
                <span className="text-[10px] font-bold text-[#121212]/60 uppercase">
                  {note.timestamp}
                </span>
              </div>

              <div className="text-xs font-black uppercase text-[#E63946] tracking-wider mb-2">
                {note.teacherName}
              </div>

              <div className="p-4 bg-[#F8F9FA] neo-border-2">
                <p className="text-sm text-[#121212] font-normal leading-relaxed">
                  "{note.message}"
                </p>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-[#121212]/15 flex items-center justify-between text-xs font-black text-[#121212]">
              <div>
                <span>— {note.studentName}</span>
                <div className="text-[10px] font-bold text-[#121212]/60 uppercase">
                  {note.gradeOrClass}
                </div>
              </div>

              <button
                onClick={() => {
                  playPopClick();
                  onLikeShoutout(note.id);
                }}
                id={`btn-like-gratitude-${note.id}`}
                className="px-3 py-1.5 bg-white hover:bg-rose-50 neo-border-2 text-xs font-black flex items-center gap-1.5 cursor-pointer active:translate-y-[1px] transition-colors"
              >
                <Heart className="w-3.5 h-3.5 text-[#E63946] fill-[#E63946]" />
                <span>{note.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredShoutouts.length === 0 && (
        <div className="text-center py-16 bg-[#F1FAEE] neo-border text-[#121212]">
          <MessageSquareHeart className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#121212]" />
          <p className="text-sm font-black uppercase tracking-wider text-[#121212]">
            No gratitude notes found matching your filter.
          </p>
          <button
            onClick={() => {
              setSelectedTagFilter('all');
              setSearchQuery('');
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
