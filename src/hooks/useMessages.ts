import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, MessageType, isMessageLocked } from '../types/message';

const STORAGE_KEY = 'messagelab_messages_phase3';

export interface SendMessageOptions {
  type?: MessageType;
  unlockAt?: string;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load messages from localStorage', e);
    }
    return [];
  });

  // Reactive clock ticker that ticks every second for real-time countdowns & automatic unlocking
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeTimeouts = useRef<number[]>([]);

  // Persist messages whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages to localStorage', e);
    }
  }, [messages]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      activeTimeouts.current.forEach(clearTimeout);
      activeTimeouts.current = [];
    };
  }, []);

  const sendMessage = useCallback((content: string, options?: SendMessageOptions) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const msgType = options?.type || 'normal';
    const unlockAt = msgType === 'timed' ? options?.unlockAt : undefined;

    const newMessage: Message = {
      id: messageId,
      sender: 'sender',
      content: trimmed,
      createdAt: new Date().toISOString(),
      status: 'sending',
      type: msgType,
      recipient: 'receiver',
      unlockAt,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Transition 1: Sending -> Delivered after ~600ms
    const t1 = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: 'delivered' } : m))
      );
    }, 600);
    activeTimeouts.current.push(t1);

    // Transition 2: Delivered -> Read after ~1400ms
    const t2 = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: 'read' } : m))
      );
    }, 1400);
    activeTimeouts.current.push(t2);
  }, []);

  // Demo Control: Immediately unlock all currently locked messages
  const unlockAllNow = useCallback(() => {
    const nowIso = new Date(Date.now() - 1000).toISOString();
    setMessages((prev) =>
      prev.map((m) => {
        if (m.type === 'timed' && isMessageLocked(m, new Date())) {
          return { ...m, unlockAt: nowIso };
        }
        return m;
      })
    );
  }, []);

  // Demo Control: Advance time by moving unlockAt closer to now
  const advanceTime = useCallback((seconds: number) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.type === 'timed' && m.unlockAt && isMessageLocked(m, new Date())) {
          const currentTarget = new Date(m.unlockAt).getTime();
          const newTarget = new Date(currentTarget - seconds * 1000).toISOString();
          return { ...m, unlockAt: newTarget };
        }
        return m;
      })
    );
  }, []);

  const resetDemo = useCallback(() => {
    // Clear any pending timers
    activeTimeouts.current.forEach(clearTimeout);
    activeTimeouts.current = [];

    // Clear state & storage
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove messages from localStorage', e);
    }
  }, []);

  return {
    messages,
    currentTime,
    sendMessage,
    unlockAllNow,
    advanceTime,
    resetDemo,
  };
}
