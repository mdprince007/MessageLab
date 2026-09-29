export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastActive?: string;
  bio?: string;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'seen';
export type MessageEffect = 'hearts' | 'gift' | 'fire' | 'confetti' | 'lock';

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'audio';
  url: string;
  name?: string;
  size?: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // 'me' or user.id
  text: string;
  timestamp: string; // formatted time or ISO
  status: MessageStatus;
  reactions: Reaction[];
  attachments?: Attachment[];
  replyToId?: string;
  isThumbsUp?: boolean;
  isSticker?: boolean;
  stickerImage?: string;
  effect?: MessageEffect;
  isGiftOpened?: boolean;

  // Time-Lock Feature Properties
  isLocked?: boolean;
  unlockAt?: string; // ISO string
  showTimerToReceiver?: boolean; // Whether the receiver sees the countdown timer
}

export interface ChatTheme {
  id: string;
  name: string;
  bubbleClass: string;
  outgoingClass: string;
  primaryColor: string;
}

export interface Conversation {
  id: string;
  participant: User;
  messages: Message[];
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  theme: ChatTheme;
  customEmoji: string;
  nicknames?: Record<string, string>;
}

/**
 * Checks if a message is currently time-locked based on the current time
 */
export function isMessageCurrentlyLocked(message: Message, now: Date = new Date()): boolean {
  if (!message.isLocked || !message.unlockAt) {
    return false;
  }
  const unlockTime = new Date(message.unlockAt).getTime();
  if (isNaN(unlockTime)) {
    return false;
  }
  return unlockTime > now.getTime();
}

/**
 * Formats remaining duration into days, hours, minutes, seconds
 */
export function formatLockCountdown(unlockAt: string, now: Date = new Date()): string {
  const target = new Date(unlockAt).getTime();
  const current = now.getTime();
  const diffMs = target - current;

  if (diffMs <= 0) return '00s';

  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
  }
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }
  if (minutes > 0) {
    return `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }
  return `${seconds}s`;
}

/**
 * Formats unlock timestamp into readable date and time
 */
export function formatUnlockDate(unlockAt: string): string {
  try {
    const d = new Date(unlockAt);
    if (isNaN(d.getTime())) return unlockAt;
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return unlockAt;
  }
}
