export type MessageStatus = 'sending' | 'delivered' | 'read';

export type MessageType = 'normal' | 'timed' | string;

export interface Message {
  id: string;
  sender: 'sender' | 'receiver' | string;
  content: string;
  createdAt: string; // ISO string timestamp
  status: MessageStatus;
  type: MessageType;

  // Phase 3: Time-Locked Message fields
  unlockAt?: string; // ISO string timestamp

  // Extensibility fields reserved for future phases
  recipient?: string;
  expiresAt?: string;
  accessMode?: 'everyone' | 'selected' | 'request';
  accessRequested?: boolean;
  accessGranted?: boolean;
}

/**
 * Returns true if the message is a time-locked message whose unlock time has not arrived yet.
 * If the unlock time is invalid, missing, or in the past, returns false (unlocked).
 */
export function isMessageLocked(message: Message, now: Date = new Date()): boolean {
  if (message.type !== 'timed' || !message.unlockAt) {
    return false;
  }
  const unlockTime = new Date(message.unlockAt).getTime();
  if (isNaN(unlockTime)) {
    return false;
  }
  return unlockTime > now.getTime();
}

/**
 * Formats the remaining time until unlockAt into a human-friendly countdown string (e.g. "02h 14m 32s" or "45s").
 */
export function formatRemainingTime(unlockAt: string, now: Date = new Date()): string {
  const target = new Date(unlockAt).getTime();
  const current = now.getTime();
  const diffMs = target - current;

  if (diffMs <= 0) {
    return '00s';
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }
  if (minutes > 0) {
    return `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }
  return `${seconds}s`;
}

/**
 * Formats the unlock timestamp into a user-friendly local date and time string.
 */
export function formatUnlockDateTime(unlockAt: string): string {
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