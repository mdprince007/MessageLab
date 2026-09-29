import { MessageEffect } from '../types/messenger';

export interface AvatarSticker {
  id: string;
  image: string;
  label: string;
  bannerBg: string;
  bannerText: string;
}

export interface SendEffectOption {
  id: MessageEffect;
  name: string;
  icon: string;
  description: string;
}

export interface SmartSuggestion {
  isComplete: boolean;
  avatarIcon: string;
  matchedText: string;
  stickers: AvatarSticker[];
  effects: SendEffectOption[];
}

export const SEND_EFFECTS: SendEffectOption[] = [
  {
    id: 'hearts',
    name: 'Hearts',
    icon: '💖',
    description: 'Floating heart animation',
  },
  {
    id: 'gift',
    name: 'Gift Box',
    icon: '🎁',
    description: 'Wrapped in surprise gift box',
  },
  {
    id: 'lock',
    name: 'Time-Lock',
    icon: '🔒',
    description: 'Locked until scheduled unlock time',
  },
  {
    id: 'fire',
    name: 'Fire',
    icon: '🔥',
    description: 'Blazing flame effect',
  },
  {
    id: 'confetti',
    name: 'Celebration',
    icon: '🎉',
    description: 'Falling party confetti',
  },
];

// High quality 3D expressive avatar faces for stickers
const AVATAR_FACES = {
  heart: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  happy: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  determined: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  crying: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
};

export function evaluateTextCompletion(rawText: string): SmartSuggestion | null {
  const text = rawText.trim();
  if (!text) return null;

  const lower = text.toLowerCase();

  // Incomplete common prefixes that should show the SEARCH 🔍 icon
  const incompletePrefixes = [
    'i',
    'i a',
    'i am',
    'i am a',
    'how',
    'how a',
    'how are',
    'how r',
    'happy',
    'good',
    'thank',
    'see',
    'what',
    'where',
    'when',
    'why',
    'who',
    'you',
    'we',
    'they',
    'is',
    'are',
    'am',
    'can',
    'will',
  ];

  if (incompletePrefixes.includes(lower)) {
    return {
      isComplete: false,
      avatarIcon: '',
      matchedText: text,
      stickers: [],
      effects: SEND_EFFECTS,
    };
  }

  // Exact or near match for complete expressions
  let isComplete = false;
  let labelText = text;

  if (
    lower.includes('i am fine') ||
    lower.includes('im fine') ||
    lower.includes('i am good') ||
    lower.includes('im good') ||
    lower.includes('all good')
  ) {
    isComplete = true;
    labelText = lower.includes('good') ? 'I am good' : 'I am fine';
  } else if (
    lower.includes('happy birthday') ||
    lower.includes('hbd') ||
    lower.includes('congratulations') ||
    lower.includes('congrats') ||
    lower.includes('how are you') ||
    lower.includes('how r u') ||
    lower.includes('love you') ||
    lower.includes('thank you') ||
    lower.includes('thanks') ||
    lower.includes('good morning') ||
    lower.includes('good night')
  ) {
    isComplete = true;
    labelText = text;
  } else if (
    text.split(/\s+/).length >= 2 ||
    /[.!?]$/.test(text)
  ) {
    isComplete = true;
    labelText = text;
  }

  // Generate contextual avatar stickers
  const stickers: AvatarSticker[] = [
    {
      id: 'st-1',
      image: AVATAR_FACES.heart,
      label: labelText,
      bannerBg: 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-pink-200',
      bannerText: labelText,
    },
    {
      id: 'st-2',
      image: AVATAR_FACES.determined,
      label: labelText,
      bannerBg: 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-red-200',
      bannerText: labelText,
    },
    {
      id: 'st-3',
      image: AVATAR_FACES.happy,
      label: labelText,
      bannerBg: 'bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-orange-200',
      bannerText: labelText,
    },
    {
      id: 'st-4',
      image: AVATAR_FACES.crying,
      label: labelText,
      bannerBg: 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-blue-200',
      bannerText: labelText,
    },
  ];

  return {
    isComplete: true,
    avatarIcon: AVATAR_FACES.heart,
    matchedText: labelText,
    stickers,
    effects: SEND_EFFECTS,
  };
}
