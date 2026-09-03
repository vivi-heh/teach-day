import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, X, ChevronRight, Camera, Maximize2 } from 'lucide-react';
import { Shoutout } from '../../types';
import { playPopClick } from '../../utils/audio';

interface SurpriseShoutoutPopupProps {
  shoutouts: Shoutout[];
  onLikeShoutout: (id: string) => void;
  onOpenSubmitShoutout: () => void;
}

export const SurpriseShoutoutPopup: React.FC<SurpriseShoutoutPopupProps> = ({
  shoutouts,
  onLikeShoutout,
  onOpenSubmitShoutout,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [expandedPhoto, setExpandedPhoto] = useState<{ url: string; caption?: string } | null>(null);

  // Auto-rotate surprise popups every 18 seconds if visible and not minimized
  useEffect(() => {
    if (!isVisible || isMinimized || shoutouts.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shoutouts.length);
    }, 18000);

    return () => clearInterval(timer);
  }, [isVisible, isMinimized, shoutouts.length]);

  if (shoutouts.length === 0) return null;

  const current = shoutouts[currentIndex % shoutouts.length];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopClick();
    setCurrentIndex((prev) => (prev + 1) % shoutouts.length);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopClick();
    onLikeShoutout(current.id);
  };

  return (
    <>
      {/* Floating Bottom-Right Toast / Balloon */}
      <div className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-96 select-none">
        <AnimatePresence mode="wait">
          {isVisible && !isMinimized && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="bg-white neo-border neo-shadow-lg p-4 text-[#121212] overflow-hidden relative"
            >
              {/* Top Accent Ribbon */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#121212]">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#E63946]">
                  <Sparkles className="w-3.5 h-3.5 text-[#E63946] animate-spin" />
                  <span>Surprise Student Shout-out</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="w-5 h-5 flex items-center justify-center bg-[#F1FAEE] hover:bg-[#E9C46A] neo-border-2 text-[#121212] text-[10px] font-black cursor-pointer"
                    title="Minimize"
                  >
                    _
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    id="btn-close-shoutout-popup"
                    className="w-5 h-5 flex items-center justify-center bg-[#F1FAEE] hover:bg-[#E63946] hover:text-white neo-border-2 text-[#121212] transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Shoutout Content */}
              <div className="flex gap-3 items-start">
                {current.photoUrl && (
                  <div
                    onClick={() =>
                      setExpandedPhoto({
                        url: current.photoUrl!,
                        caption: current.photoCaption || current.message,
                      })
                    }
                    className="relative w-16 h-16 neo-border-2 overflow-hidden shrink-0 cursor-pointer group bg-[#F1FAEE]"
                    title="Click to view photo full size"
                  >
                    <img
                      src={current.photoUrl}
                      alt="Classroom memory"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-black uppercase text-[#121212] truncate">
                      To: {current.teacherName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 neo-border-2 bg-[#A8DADC] text-[#121212] font-black uppercase shrink-0">
                      {current.tag}
                    </span>
                  </div>

                  <p className="text-xs text-[#121212] leading-snug line-clamp-3 italic font-serif">
                    “{current.message}”
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-[#121212]/75 font-bold uppercase">
                    <span className="truncate">
                      — {current.studentName} ({current.gradeOrClass})
                    </span>
                    <span className="shrink-0 text-[10px]">{current.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-3 pt-2 border-t-2 border-[#121212] flex items-center justify-between text-xs">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1.5 px-2 py-1 bg-[#F1FAEE] hover:bg-[#E9C46A] neo-border-2 text-[#E63946] font-black text-xs transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#E63946]" />
                  <span>{current.likes} Loves</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenSubmitShoutout}
                    className="text-[11px] text-[#121212] font-black uppercase hover:underline cursor-pointer"
                  >
                    + Post Yours
                  </button>

                  <button
                    onClick={handleNext}
                    id="btn-next-surprise-shoutout"
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#121212] hover:bg-stone-900 text-white font-black uppercase text-xs neo-shadow-sm transition-all cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px]"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Minimized Floating Bell */}
          {isMinimized && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setIsMinimized(false)}
              className="p-3 bg-[#E9C46A] hover:bg-[#F4A261] text-[#121212] neo-border neo-shadow flex items-center gap-2 text-xs font-black uppercase cursor-pointer"
            >
              <span>🎉</span>
              <span className="hidden sm:inline">Surprise Shout-outs</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded Classroom Photo Modal */}
      {expandedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setExpandedPhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white neo-border neo-shadow-lg p-4 text-[#121212]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b-2 border-[#121212]">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#E63946]">
                <Camera className="w-4 h-4 text-[#E63946]" />
                <span>Classroom Moment</span>
              </div>
              <button
                onClick={() => setExpandedPhoto(null)}
                className="p-1 bg-[#F1FAEE] hover:bg-[#E63946] hover:text-white neo-border-2 text-[#121212] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="neo-border-2 overflow-hidden max-h-[70vh] bg-[#F1FAEE]">
              <img
                src={expandedPhoto.url}
                alt="Classroom memory expanded"
                className="w-full h-full object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            {expandedPhoto.caption && (
              <p className="text-xs text-[#121212] italic font-serif text-center mt-3">
                “{expandedPhoto.caption}”
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
