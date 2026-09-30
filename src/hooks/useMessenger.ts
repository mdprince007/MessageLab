import { useState, useEffect, useCallback, useMemo } from 'react';
import { Conversation, Message, ChatTheme, MessageEffect, isMessageCurrentlyLocked } from '../types/messenger';
import { INITIAL_CONVERSATIONS } from '../data/mockData';

const STORAGE_KEY = 'messenger_conversations_v3';

export interface SendMessageOptions {
  isThumbsUp?: boolean;
  isSticker?: boolean;
  stickerImage?: string;
  effect?: MessageEffect;
  isLocked?: boolean;
  unlockAt?: string;
  showTimerToReceiver?: boolean;
  senderId?: string;
}

export function useMessenger() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved messenger data', e);
    }
    return INITIAL_CONVERSATIONS;
  });

  const [activeId, setActiveId] = useState<string>(() => {
    return INITIAL_CONVERSATIONS[0].id;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<'audio' | 'video' | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [perspective, setPerspective] = useState<'sender' | 'receiver'>('sender');

  // Live 1-second clock ticker for automatic unlocking & live countdowns
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist conversations
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save messenger data', e);
    }
  }, [conversations]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeId) || conversations[0];
  }, [conversations, activeId]);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  const sendMessage = useCallback(
    (text: string, options?: SendMessageOptions) => {
      const isThumbsUp = options?.isThumbsUp ?? false;
      const isSticker = options?.isSticker ?? false;
      const stickerImage = options?.stickerImage;
      const effect = options?.effect;
      const isLocked = options?.isLocked ?? false;
      const unlockAt = options?.unlockAt;
      const showTimerToReceiver = options?.showTimerToReceiver ?? true;
      const actualSenderId = options?.senderId || 'me';

      const trimmed = text.trim();
      if (!trimmed && !isThumbsUp && !isSticker) return;

      const messageContent = isThumbsUp
        ? activeConversation?.customEmoji || '👍'
        : trimmed;

      const newMsgId = `m-${Date.now()}`;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

      const newMsg: Message = {
        id: newMsgId,
        conversationId: activeId,
        senderId: actualSenderId,
        text: messageContent,
        timestamp: timeStr,
        status: actualSenderId === 'me' ? 'sending' : 'delivered',
        reactions: [],
        isThumbsUp,
        isSticker,
        stickerImage,
        effect,
        isLocked,
        unlockAt,
        showTimerToReceiver,
      };

      // Add message immediately
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeId) {
            return {
              ...c,
              messages: [...c.messages, newMsg],
            };
          }
          return c;
        })
      );

      // Only simulate delivery and automated reply if sent by 'me'
      if (actualSenderId === 'me') {
        // Simulate delivery after 400ms
        setTimeout(() => {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === activeId) {
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === newMsgId ? { ...m, status: 'delivered' } : m
                  ),
                };
              }
              return c;
            })
          );
        }, 400);

        // Simulate seen after 900ms (unless locked)
        setTimeout(() => {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === activeId) {
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === newMsgId ? { ...m, status: 'seen' } : m
                  ),
                };
              }
              return c;
            })
          );
        }, 900);

        // If it's a locked message, simulate a surprised acknowledgment reply from recipient!
        setTimeout(() => {
          setIsTyping(true);
        }, 1500);

        setTimeout(() => {
          setIsTyping(false);
          const normalReplies = [
            'Sounds great! Glad to hear that 😊',
            'Haha, totally agree with you! 🙌',
            'Awesome! Thanks for sharing.',
            'Super cool! Let me check and get back to you.',
            'Love it! Talk soon ✨',
          ];
          const lockedReplies = [
            'Wait, you sent a time-locked message! 🔒 Looking forward to opening it!',
            'Ooh, a locked surprise? I can see the timer! ⏱️',
            'I see a secret message! Can’t wait until it unlocks!',
          ];

          const replyPool = isLocked ? lockedReplies : normalReplies;
          const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];
          const replyTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

          const replyMsg: Message = {
            id: `reply-${Date.now()}`,
            conversationId: activeId,
            senderId: activeConversation.participant.id,
            text: randomReply,
            timestamp: replyTime,
            status: 'delivered',
            reactions: [],
          };

          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === activeId) {
                return {
                  ...c,
                  messages: [...c.messages, replyMsg],
                };
              }
              return c;
            })
          );
        }, 3500);
      }
    },
    [activeId, activeConversation]
  );

  const toggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeId) {
            return {
              ...c,
              messages: c.messages.map((m) => {
                if (m.id === messageId) {
                  const existingIndex = m.reactions.findIndex((r) => r.userId === 'me');
                  const updatedReactions = [...m.reactions];
                  if (existingIndex > -1) {
                    if (updatedReactions[existingIndex].emoji === emoji) {
                      // Remove reaction
                      updatedReactions.splice(existingIndex, 1);
                    } else {
                      // Change reaction
                      updatedReactions[existingIndex] = { emoji, userId: 'me' };
                    }
                  } else {
                    // Add new reaction
                    updatedReactions.push({ emoji, userId: 'me' });
                  }
                  return { ...m, reactions: updatedReactions };
                }
                return m;
              }),
            };
          }
          return c;
        })
      );
    },
    [activeId]
  );

  const toggleGiftOpened = useCallback(
    (messageId: string) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, isGiftOpened: !m.isGiftOpened } : m
              ),
            };
          }
          return c;
        })
      );
    },
    [activeId]
  );

  // Toggle receiver timer visibility on an already sent message
  const toggleTimerVisibility = useCallback(
    (messageId: string) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId
                  ? { ...m, showTimerToReceiver: !m.showTimerToReceiver }
                  : m
              ),
            };
          }
          return c;
        })
      );
    },
    [activeId]
  );

  // Demo Control: Immediately unlock any currently locked messages
  const unlockAllLockedNow = useCallback(() => {
    const pastIso = new Date(Date.now() - 1000).toISOString();
    setConversations((prev) =>
      prev.map((c) => ({
        ...c,
        messages: c.messages.map((m) => {
          if (m.isLocked && isMessageCurrentlyLocked(m, new Date())) {
            return { ...m, unlockAt: pastIso };
          }
          return m;
        }),
      }))
    );
  }, []);

  const deleteMessage = useCallback(
    (messageId: string) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeId) {
            return {
              ...c,
              messages: c.messages.filter((m) => m.id !== messageId),
            };
          }
          return c;
        })
      );
    },
    [activeId]
  );

  const changeTheme = useCallback(
    (theme: ChatTheme) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, theme } : c))
      );
    },
    [activeId]
  );

  const changeCustomEmoji = useCallback(
    (emoji: string) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, customEmoji: emoji } : c))
      );
    },
    [activeId]
  );

  const toggleDetails = useCallback(() => {
    setIsDetailsOpen((prev) => !prev);
  }, []);

  const togglePerspective = useCallback(() => {
    setPerspective((prev) => (prev === 'sender' ? 'receiver' : 'sender'));
  }, []);

  const startCall = useCallback((type: 'audio' | 'video') => {
    setActiveCall(type);
  }, []);

  const endCall = useCallback(() => {
    setActiveCall(null);
  }, []);

  const resetAllData = useCallback(() => {
    setConversations(INITIAL_CONVERSATIONS);
    setActiveId(INITIAL_CONVERSATIONS[0].id);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.participant.name.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  return {
    conversations: filteredConversations,
    allConversationsCount: conversations.length,
    activeConversation,
    searchQuery,
    setSearchQuery,
    isDetailsOpen,
    activeCall,
    isTyping,
    perspective,
    currentTime,
    selectConversation,
    sendMessage,
    toggleReaction,
    toggleGiftOpened,
    toggleTimerVisibility,
    unlockAllLockedNow,
    togglePerspective,
    deleteMessage,
    changeTheme,
    changeCustomEmoji,
    toggleDetails,
    startCall,
    endCall,
    resetAllData,
  };
}
