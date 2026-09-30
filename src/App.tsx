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

  // Workbench Mode: Single focused view vs Dual Split-Screen (Sender ⇄ Receiver)
  const [workbenchMode, setWorkbenchMode] = useState<'single' | 'dual'>('dual');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black font-sans antialiased text-[#050505]">
      {/* 1. Leftmost Navigation Rail */}
      <NavigationRail
        workbenchMode={workbenchMode}
        onToggleWorkbenchMode={() =>
          setWorkbenchMode((prev) => (prev === 'dual' ? 'single' : 'dual'))
        }
        onResetData={resetAllData}
      />

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

      {/* 3. Main Workbench Content Area */}
      <div
        className={`${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        } flex-1 flex flex-col h-full overflow-hidden`}
      >
        {/* Top Product Workbench Control Bar */}
        <div className="hidden sm:flex h-11 items-center justify-between px-4 bg-[#0d0d0d] border-b border-slate-900 text-xs select-none">
          <div className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-blue-600 to-cyan-500 text-[11px] font-bold text-white shadow-xs">
              🧪
            </span>
            <span className="font-bold tracking-tight text-white">MessageLab</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-medium hidden lg:inline">
              Build → Improve → Share
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-950/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-800/40">
              ● Phase 3 Active: Time-Locked Messages
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => setWorkbenchMode('single')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition ${
                  workbenchMode === 'single'
                    ? 'bg-[#0084FF] text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Focused single chat window with perspective toggle"
              >
                <span>📱 Single View</span>
              </button>
              <button
                type="button"
                onClick={() => setWorkbenchMode('dual')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition ${
                  workbenchMode === 'dual'
                    ? 'bg-amber-500 text-black shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Side-by-side synchronized view: Sender on left, Receiver on right"
              >
                <span>⚡ Dual Split-Screen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Windows Container */}
        {activeConversation ? (
          workbenchMode === 'dual' ? (
            /* DUAL SPLIT-SCREEN WORKBENCH (Sender on Left, Receiver on Right) */
            <div className="flex flex-1 overflow-hidden divide-x divide-slate-900">
              {/* Left Column: Sender Perspective */}
              <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
                <div className="bg-emerald-950/70 px-3 py-1 text-[11px] font-semibold text-emerald-300 border-b border-emerald-900/60 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    🟢 SENDER VIEW (You) — Compose & Time-Lock Settings
                  </span>
                  <span className="text-[10px] text-emerald-400/70">Live Synchronized</span>
                </div>
                <ChatWindow
                  conversation={activeConversation}
                  isTyping={isTyping}
                  isDetailsOpen={false}
                  perspective="sender"
                  currentTime={currentTime}
                  onTogglePerspective={togglePerspective}
                  onUnlockNow={unlockAllLockedNow}
                  onToggleDetails={toggleDetails}
                  onSendMessage={(text, opts) => sendMessage(text, { ...opts, senderId: 'me' })}
                  onReact={toggleReaction}
                  onDelete={deleteMessage}
                  onToggleGift={toggleGiftOpened}
                  onToggleTimerVisibility={toggleTimerVisibility}
                  onChangeTheme={changeTheme}
                  onChangeEmoji={changeCustomEmoji}
                  onStartCall={startCall}
                  onBack={() => setMobileView('list')}
                  showPerspectiveToggle={false}
                />
              </div>

              {/* Right Column: Receiver Perspective */}
              <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden bg-black">
                <div className="bg-sky-950/70 px-3 py-1 text-[11px] font-semibold text-sky-300 border-b border-sky-900/60 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    🔵 RECEIVER VIEW ({activeConversation.participant.name}) — Recipient Countdown & Lock State
                  </span>
                  <span className="text-[10px] text-sky-400/70">Live Synchronized</span>
                </div>
                <ChatWindow
                  conversation={activeConversation}
                  isTyping={false}
                  isDetailsOpen={isDetailsOpen}
                  perspective="receiver"
                  currentTime={currentTime}
                  onTogglePerspective={togglePerspective}
                  onUnlockNow={unlockAllLockedNow}
                  onToggleDetails={toggleDetails}
                  onSendMessage={(text, opts) =>
                    sendMessage(text, { ...opts, senderId: activeConversation.participant.id })
                  }
                  onReact={toggleReaction}
                  onDelete={deleteMessage}
                  onToggleGift={toggleGiftOpened}
                  onToggleTimerVisibility={toggleTimerVisibility}
                  onChangeTheme={changeTheme}
                  onChangeEmoji={changeCustomEmoji}
                  onStartCall={startCall}
                  onBack={() => setMobileView('list')}
                  showPerspectiveToggle={false}
                />
              </div>
            </div>
          ) : (
            /* SINGLE VIEW */
            <div className="flex flex-1 h-full overflow-hidden">
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
          )
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-black text-slate-500 text-sm">
            Select a conversation to start messaging
          </div>
        )}
      </div>

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