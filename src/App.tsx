import React, { useState } from 'react';
import { useMessenger } from './hooks/useMessenger';
import NavigationRail from './components/NavigationRail';
import ChatsSidebar from './components/ChatsSidebar';
import ChatWindow from './components/ChatWindow';
import CallModal from './components/CallModal';

export default function App() {
  const {
    conversations,
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
  } = useMessenger();

  // Mobile state: toggle between chats list and active chat window
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black font-sans antialiased text-[#050505]">
      {/* 1. Leftmost Navigation Rail */}
      <NavigationRail onResetData={resetAllData} />

      {/* 2. Chats Sidebar (Conversations List) */}
      <div
        className={`${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        } w-full md:w-auto h-full flex-shrink-0`}
      >
        <ChatsSidebar
          conversations={conversations}
          activeId={activeConversation?.id || ''}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectConversation={(id) => {
            selectConversation(id);
            setMobileView('chat');
          }}
        />
      </div>

      {/* 3. Main Chat Window */}
      {activeConversation ? (
        <div
          className={`${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          } flex-1 h-full overflow-hidden`}
        >
          <ChatWindow
            conversation={activeConversation}
            isTyping={isTyping}
            isDetailsOpen={isDetailsOpen}
            perspective={perspective}
            currentTime={currentTime}
            onTogglePerspective={togglePerspective}
            onUnlockNow={unlockAllLockedNow}
            onToggleDetails={toggleDetails}
            onSendMessage={sendMessage}
            onReact={toggleReaction}
            onDelete={deleteMessage}
            onToggleGift={toggleGiftOpened}
            onToggleTimerVisibility={toggleTimerVisibility}
            onChangeTheme={changeTheme}
            onChangeEmoji={changeCustomEmoji}
            onStartCall={startCall}
            onBack={() => setMobileView('list')}
          />
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-black text-slate-500 text-sm">
          Select a conversation to start messaging
        </div>
      )}

      {/* 4. Audio/Video Calling Screen Overlay */}
      {activeCall && activeConversation && (
        <CallModal
          type={activeCall}
          participant={activeConversation.participant}
          onEndCall={endCall}
        />
      )}
    </div>
  );
}