import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UniversalTributeHome } from './components/Home/UniversalTributeHome';
import { CardGallery } from './components/CardGallery/CardGallery';
import { CreateCardModal } from './components/CardGallery/CreateCardModal';
import { GameModeHub } from './components/GameMode/GameModeHub';
import { MemoriesWall } from './components/MemoriesWall/MemoriesWall';
import { SurpriseShoutoutPopup } from './components/ShoutoutPopup/SurpriseShoutoutPopup';
import { SubmitShoutoutModal } from './components/ShoutoutPopup/SubmitShoutoutModal';
import { CelebrationRevealModal } from './components/CelebrationReveal/CelebrationRevealModal';
import { HappyTeachersDayModal } from './components/HappyTeachersDayModal';
import {
  INITIAL_TEACHERS,
  INITIAL_CARDS,
  INITIAL_SHOUTOUTS,
} from './data/mockData';
import { Teacher, GreetingCard, Shoutout, CelebrationRevealItem } from './types';
import { Apple, Sparkles, Heart, Mail, MessageSquare, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cards' | 'games' | 'memories'>('dashboard');
  const [soundActive, setSoundActive] = useState<boolean>(true);

  // Initial celebratory intro popup opens first before homescreen
  const [isHappyTeachersDayOpen, setIsHappyTeachersDayOpen] = useState<boolean>(true);

  // Data states with localStorage initialization
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('teachers_day_teachers_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TEACHERS;
  });

  const [cards, setCards] = useState<GreetingCard[]>(() => {
    const saved = localStorage.getItem('teachers_day_cards_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CARDS;
  });

  const [shoutouts, setShoutouts] = useState<Shoutout[]>(() => {
    const saved = localStorage.getItem('teachers_day_shoutouts_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SHOUTOUTS;
  });

  // Modals state
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [cardPrefillTeacherId, setCardPrefillTeacherId] = useState<string | undefined>(undefined);
  const [isSubmitShoutoutOpen, setIsSubmitShoutoutOpen] = useState(false);
  const [celebrationRevealItem, setCelebrationRevealItem] = useState<CelebrationRevealItem | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('teachers_day_teachers_v3', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('teachers_day_cards_v3', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('teachers_day_shoutouts_v3', JSON.stringify(shoutouts));
  }, [shoutouts]);

  // Handler: Add new greeting card
  const handleAddCard = (newCard: GreetingCard) => {
    setCards((prev) => [newCard, ...prev]);
    setCelebrationRevealItem({
      type: 'card',
      data: newCard,
      animationType: newCard.animationType || 'fireworks',
      wrapStyle: newCard.wrapStyle || 'crimson',
    });
  };

  // Handler: React to a card
  const handleReactToCard = (cardId: string, reactionType: 'love' | 'apple' | 'star' | 'respect') => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            reactions: {
              ...c.reactions,
              [reactionType]: c.reactions[reactionType] + 1,
            },
          };
        }
        return c;
      })
    );
  };

  // Handler: Add shout-out
  const handleAddShoutout = (newShoutout: Shoutout) => {
    setShoutouts((prev) => [newShoutout, ...prev]);
    setCelebrationRevealItem({
      type: 'shoutout',
      data: newShoutout,
      animationType: newShoutout.animationType || 'fireworks',
      wrapStyle: 'ochre',
    });
  };

  const handleLikeShoutout = (shoutoutId: string) => {
    setShoutouts((prev) =>
      prev.map((s) => (s.id === shoutoutId ? { ...s, likes: s.likes + 1 } : s))
    );
  };

  const openCreateCardModal = (prefilledTeacherId?: string) => {
    setCardPrefillTeacherId(prefilledTeacherId);
    setIsCreateCardOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#121212] flex flex-col font-sans selection:bg-[#E9C46A] selection:text-[#121212] grid-paper">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateCard={() => openCreateCardModal()}
        onOpenSubmitShoutout={() => setIsSubmitShoutoutOpen(true)}
        onOpenHappyTeachersDayModal={() => setIsHappyTeachersDayOpen(true)}
        soundActive={soundActive}
        setSoundActive={setSoundActive}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {activeTab === 'dashboard' && (
          <UniversalTributeHome
            cards={cards}
            shoutouts={shoutouts}
            onOpenCreateCard={() => openCreateCardModal()}
            onOpenSubmitShoutout={() => setIsSubmitShoutoutOpen(true)}
            onReactToCard={handleReactToCard}
            onLikeShoutout={handleLikeShoutout}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'cards' && (
          <CardGallery
            cards={cards}
            teachers={teachers}
            onOpenCreateCard={openCreateCardModal}
            onReactToCard={handleReactToCard}
            onRevealCelebration={(card) =>
              setCelebrationRevealItem({
                type: 'card',
                data: card,
                animationType: card.animationType || 'fireworks',
                wrapStyle: card.wrapStyle || 'crimson',
              })
            }
          />
        )}

        {activeTab === 'games' && <GameModeHub />}

        {activeTab === 'memories' && (
          <MemoriesWall
            shoutouts={shoutouts}
            teachers={teachers}
            onOpenSubmitShoutout={() => setIsSubmitShoutoutOpen(true)}
            onLikeShoutout={handleLikeShoutout}
          />
        )}
      </main>

      {/* Floating Surprise Shout-out Popup Notification */}
      <SurpriseShoutoutPopup
        shoutouts={shoutouts}
        onLikeShoutout={handleLikeShoutout}
        onOpenSubmitShoutout={() => setIsSubmitShoutoutOpen(true)}
      />

      {/* Modals */}
      <CreateCardModal
        isOpen={isCreateCardOpen}
        onClose={() => setIsCreateCardOpen(false)}
        teachers={teachers}
        prefilledTeacherId={cardPrefillTeacherId}
        onAddCard={handleAddCard}
      />

      <SubmitShoutoutModal
        isOpen={isSubmitShoutoutOpen}
        onClose={() => setIsSubmitShoutoutOpen(false)}
        teachers={teachers}
        onSubmit={handleAddShoutout}
      />

      {/* Celebratory Reveal Modal */}
      <CelebrationRevealModal
        isOpen={!!celebrationRevealItem}
        onClose={() => setCelebrationRevealItem(null)}
        item={celebrationRevealItem}
      />

      {/* Opening Pop-out: Happy Teachers' Day Greeting (shown first before homescreen) */}
      <HappyTeachersDayModal
        isOpen={isHappyTeachersDayOpen}
        onClose={() => setIsHappyTeachersDayOpen(false)}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsHappyTeachersDayOpen(false);
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t-[3px] border-[#121212] text-[#121212] py-10 px-4 sm:px-6 lg:px-8 text-center text-xs neo-shadow-sm">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="neo-border bg-[#E9C46A] p-1.5 flex items-center justify-center">
              <Apple className="w-5 h-5 text-[#121212]" />
            </span>
            <span className="text-xl font-black uppercase tracking-tight italic text-[#121212] heading-pop">
              Teachers’ Day <span className="text-[#E63946]">2026</span> // Universal Tribute Portal
            </span>
            <span className="neo-border bg-[#A8DADC] p-1.5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#121212]" />
            </span>
          </div>

          <div className="bg-[#F1FAEE] neo-border-2 p-4 max-w-xl mx-auto neo-shadow-sm text-[#121212]">
            <p className="font-semibold text-xs sm:text-sm italic">
              “Education is the most powerful weapon which you can use to change the world.” — Nelson Mandela
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[#121212] font-black uppercase text-[11px] tracking-wider">
            <span className="bg-[#E9C46A] neo-border-2 px-3 py-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#121212] fill-current" /> Dedicated to Every Teacher
            </span>
            <span className="bg-[#F4A261] neo-border-2 px-3 py-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#121212]" /> {cards.length} Wishes & Cards
            </span>
            <span className="bg-[#A8DADC] neo-border-2 px-3 py-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#121212]" /> {shoutouts.length} Gratitude Notes
            </span>
            <span className="bg-[#E63946] text-white neo-border-2 px-3 py-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-white" /> 2026 Commendation
            </span>
          </div>

          <p className="text-[#121212] text-xs pt-3 font-bold uppercase tracking-wider">
            Dedicated with everlasting gratitude to all teachers and mentors who shape our future.
          </p>
        </div>
      </footer>
    </div>
  );
}
