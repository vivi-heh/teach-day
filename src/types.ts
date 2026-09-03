export type CelebrationAnimationType = 'fireworks' | 'balloons' | 'origami' | 'blossom' | 'trophy' | 'chalkboard';

export type GiftWrapStyle = 'crimson' | 'gold' | 'emerald' | 'bento' | 'midnight' | 'teal' | 'ochre' | 'slate';

export interface StudentGift {
  id: string;
  teacherId: string;
  teacherName: string;
  studentName: string;
  studentGroup?: string;
  giftId?: string;
  giftType?: string;
  giftName: string;
  giftIcon: string;
  giftDescription?: string;
  wrapStyle: GiftWrapStyle;
  animationType: CelebrationAnimationType;
  message: string;
  date?: string;
  timestamp?: string;
  unwrapped?: boolean;
  unlocked?: boolean;
  reactionsCount?: number;
}

export interface Teacher {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  coverImage: string;
  experienceYears: number;
  quote: string;
  bio: string;
  accolades: {
    title: string;
    description: string;
    icon: string;
  }[];
  stats: {
    applesReceived: number;
    thankYouNotes: number;
    hearts: number;
    classesTaught: number;
  };
  gift: {
    giftType: string;
    giftTitle: string;
    badgeName: string;
    revealQuote: string;
    studentMessage: string;
    virtualTrophy: string;
    giftUnlocked?: boolean;
    animationType?: CelebrationAnimationType;
  };
  receivedGifts?: StudentGift[];
}

export interface GreetingCard {
  id: string;
  teacherId: string; // 'all' or specific teacher id
  teacherName: string;
  senderName: string;
  senderRole: string; // e.g. 'Class of 2024', 'Grade 10-A', 'Alumni'
  theme: 'chalkboard' | 'watercolor' | 'golden' | 'origami' | 'vintage';
  headline: string;
  frontDesign: string;
  message: string;
  favoriteQuote?: string;
  animationType?: CelebrationAnimationType;
  wrapStyle?: GiftWrapStyle;
  reactions: {
    love: number;
    apple: number;
    star: number;
    respect: number;
  };
  date: string;
  userReacted?: { [key: string]: boolean };
}

export interface Shoutout {
  id: string;
  studentName: string;
  gradeOrClass: string;
  teacherId: string;
  teacherName: string;
  message: string;
  photoUrl?: string;
  photoCaption?: string;
  tag: 'Inspirational' | 'Funny' | 'Heartfelt' | 'Life Lesson' | 'Memorable';
  animationType?: CelebrationAnimationType;
  timestamp: string;
  likes: number;
}

export interface CelebrationRevealItem {
  type: 'gift' | 'card' | 'teacher_surprise' | 'shoutout';
  title?: string;
  subtitle?: string;
  recipientName?: string;
  senderName?: string;
  senderGroup?: string;
  message?: string;
  quote?: string;
  icon?: string;
  badgeName?: string;
  wrapStyle?: GiftWrapStyle;
  cardTheme?: 'golden' | 'chalkboard' | 'watercolor' | 'origami' | 'vintage';
  headline?: string;
  animationType?: CelebrationAnimationType;
  date?: string;
  photoUrl?: string;
  photoCaption?: string;
  data?: StudentGift | GreetingCard | Teacher | Shoutout | any;
}

export interface ClassroomPhoto {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  teacherName: string;
  event: string;
  year: string;
  likes: number;
}

export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  teacherWisdom: string;
}
