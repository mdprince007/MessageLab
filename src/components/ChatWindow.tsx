import React, { useState } from 'react';
import { Conversation, ChatTheme, MessageEffect } from '../types/messenger';
import ChatHeader from './ChatHeader';
import MessageArea from './MessageArea';
import MessageComposer from './MessageComposer';
import ChatDetailsSidebar from './ChatDetailsSidebar';
import ThemeModal from './ThemeModal';

interface ChatWindowProps {
  conversation: Conversation;
  isTyping: boolean;
  isDetailsOpen: boolean;
  perspective: 'sender' | 'receiver';
  currentTime: Date;
  onTogglePerspective?: () => void;
  onUnlockNow?: () => void;
  onToggleDetails: () => void;
  onSendMessage: (
    text: string,
    options?: {
      isThumbsUp?: boolean;
      isSticker?: boolean;
      stickerImage?: string;
      effect?: MessageEffect;
      isLocked?: boolean;
      unlockAt?: string;
      showTimerToReceiver?: boolean;
      senderId?: string;
    }
  ) => void;
  onReact: (messageId: string, emoji: string) => void;
  onDelete: (messageId: string) => void;
  onToggleGift?: (messageId: string) => void;
  onToggleTimerVisibility?: (messageId: string) => void;
  onChangeTheme: (theme: ChatTheme) => void;
  onChangeEmoji: (emoji: string) => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onBack?: () => void;
  showPerspectiveToggle?: boolean;
}

export default function ChatWindow({
  conversation,
  isTyping,
  isDetailsOpen,
  perspective,
  currentTime,
  onTogglePerspective,
  onUnlockNow,
  onToggleDetails,
  onSendMessage,
  onReact,
  onDelete,
  onToggleGift,
  onToggleTimerVisibility,
  onChangeTheme,
  onChangeEmoji,
  onStartCall,
  onBack,
  showPerspectiveToggle = true,
}: ChatWindowProps) {
  const [showThemeModal, setShowThemeModal] = useState(false);

  return (
    <div className="flex flex-1 overflow-hidden bg-[#000000]">
      {/* Main Chat Flow */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <ChatHeader
          conversation={conversation}
          perspective={perspective}
          currentTime={currentTime}
          onTogglePerspective={onTogglePerspective}
          onUnlockNow={onUnlockNow}
          onBack={onBack}
          onStartCall={onStartCall}
          onToggleDetails={onToggleDetails}
          isDetailsOpen={isDetailsOpen}
          showPerspectiveToggle={showPerspectiveToggle}
        />

        {/* Message Area */}
        <MessageArea
          conversation={conversation}
          isTyping={isTyping}
          perspective={perspective}
          currentTime={currentTime}
          onReact={onReact}
          onDelete={onDelete}
          onToggleGift={onToggleGift}
          onToggleTimerVisibility={onToggleTimerVisibility}
        />

        {/* Composer */}
        <MessageComposer
          customEmoji={conversation.customEmoji}
          theme={conversation.theme}
          onSendMessage={onSendMessage}
        />
      </div>

      {/* Right Details Sidebar */}
      {isDetailsOpen && (
        <ChatDetailsSidebar
          conversation={conversation}
          onClose={onToggleDetails}
          onOpenThemeModal={() => setShowThemeModal(true)}
          onChangeEmoji={onChangeEmoji}
        />
      )}

      {/* Theme Picker Modal */}
      {showThemeModal && (
        <ThemeModal
          currentTheme={conversation.theme}
          onSelectTheme={onChangeTheme}
          onClose={() => setShowThemeModal(false)}
        />
      )}
    </div>
  );
}