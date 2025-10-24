
import React, { useState } from 'react';
import RecruitmentSandbox from './components/RecruitmentSandbox';
import ChatBot from './components/ChatBot';
import { BotIcon, ClipboardIcon } from './components/icons';

type View = 'sandbox' | 'chat';

const App: React.FC = () => {
  const [view, setView] = useState<View>('sandbox');

  const navButtonClasses = (isActive: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-blue-500 flex items-center gap-2 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col antialiased">
      <header className="bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
              Trakin Tech Recruitment AI
            </h1>
            <nav className="flex items-center space-x-1 p-1 bg-zinc-900 rounded-xl">
              <button
                onClick={() => setView('sandbox')}
                className={navButtonClasses(view === 'sandbox')}
              >
                <ClipboardIcon className="h-5 w-5" />
                Generator
              </button>
              <button
                onClick={() => setView('chat')}
                className={navButtonClasses(view === 'chat')}
              >
                <BotIcon className="h-5 w-5" />
                Chat
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {view === 'sandbox' ? <RecruitmentSandbox /> : <ChatBot />}
      </main>
       <footer className="text-center p-4 text-xs text-zinc-600 border-t border-zinc-900">
          Powered by Gemini API
      </footer>
    </div>
  );
};

export default App;
