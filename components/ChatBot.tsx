
import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { startChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { SendIcon, UserIcon, BotIcon } from './icons';

const ChatBot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(startChat());
    setMessages([
        {
            id: 'init',
            role: 'model',
            text: 'Hello! How can I assist you today?'
        }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    let fullResponse = '';
    const modelMessageId = (Date.now() + 1).toString();

    setMessages((prev) => [
        ...prev,
        { id: modelMessageId, role: 'model', text: '...' },
    ]);

    try {
      const result = await chat.sendMessageStream({ message: input });
      
      for await (const chunk of result) {
        fullResponse += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMessageId ? { ...msg, text: fullResponse } : msg
          )
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMessageId ? { ...msg, text: 'Sorry, I encountered an error.' } : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto bg-zinc-900 rounded-xl border border-zinc-800">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {msg.role === 'model' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <BotIcon className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-md p-3 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
               {msg.role === 'user' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-zinc-800">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-shadow text-zinc-200"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-500/50 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-blue-500"
          >
            <SendIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;