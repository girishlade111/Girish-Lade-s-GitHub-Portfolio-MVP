import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Loader2, Link } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';
import type { ChatMessage, GroundingSource } from '../types';
import { PROJECTS, STATS, SOCIAL_LINKS } from '../constants';

const portfolioContext = {
  name: "Girish Balaso Lade",
  bio: "UX/UI Designer & Developer obsessed with building stuff people actually use... for free.",
  roles: [
    "UX/UI Designer",
    "AI Agent Builder",
    "Open Source Developer",
    "Startup Founder",
  ],
  about: "I’m Girish Balaso Lade — a developer, designer, and AI enthusiast passionate about creating open-source tools and modern web experiences. I love mixing creativity with code to bring design to life.",
  projects: PROJECTS.map(({ name, description, longDescription, tags, language, githubUrl, liveUrl }) => ({
    name,
    description: longDescription || description,
    tags,
    language,
    githubUrl,
    liveUrl,
  })),
  stats: STATS.map(s => ({ label: s.label, value: s.value })),
  socials: SOCIAL_LINKS.map(s => ({ name: s.name, url: s.url })),
};


const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
       if (messages.length === 0) {
        setMessages([
          {
            role: 'model',
            content: "Hi! I'm an AI assistant. You can ask me anything about Girish, his projects, or his skills.",
          },
        ]);
      }
    }
  }, [isOpen, messages.length]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmedInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      const prompt = `You are an AI assistant for the portfolio website of Girish Balaso Lade. Your goal is to answer questions about him, his skills, and his projects based on the context provided below. Be friendly, concise, and helpful. If the information is not in the context, you can use the search tool to find an answer.

**Portfolio Context:**
${JSON.stringify(portfolioContext)}

---

**User Question:** ${trimmedInput}`;
      
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
        },
      });

      let modelResponse = '';
      let sources: GroundingSource[] = [];
      const modelMessage: ChatMessage = { role: 'model', content: '' };
      setMessages(prev => [...prev, modelMessage]);

      for await (const chunk of responseStream) {
        modelResponse += chunk.text;
        
        const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if(groundingChunks) {
          const newSources = groundingChunks
            .map(c => c.web)
            .filter((s): s is { uri: string, title: string } => !!s && !!s.uri && !!s.title);
          sources.push(...newSources);
        }
        
        setMessages(prev =>
          prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, content: modelResponse } : msg
          )
        );
      }
      
      const uniqueSources = Array.from(new Set(sources.map(s => s.uri)))
         .map(uri => sources.find(s => s.uri === uri) as GroundingSource);

      setMessages(prev =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, content: modelResponse, sources: uniqueSources } : msg
        )
      );

    } catch (error) {
      console.error('Error fetching AI response:', error);
       setMessages(prev => [
        ...prev,
        { role: 'model', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, messages]);


  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-[#00AEEF] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300 z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={30} /> : <MessageSquare size={30} />}
      </button>

      {isOpen && (
        <div 
            className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] max-w-md h-[70vh] max-h-[600px] flex flex-col glass-card rounded-lg shadow-2xl z-50"
            role="dialog"
            aria-modal="true"
        >
          <header className="p-4 border-b border-gray-700/50 flex justify-between items-center flex-shrink-0">
            <h2 className="text-lg font-bold text-white">AI Assistant</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                <X className="w-6 h-6" />
            </button>
          </header>

          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-sm ${message.role === 'user' ? 'bg-[#00AEEF] text-white' : 'bg-gray-800 text-gray-300'}`}>
                   <div 
                     className="prose prose-sm prose-invert"
                     dangerouslySetInnerHTML={{ __html: marked.parse(message.content) as string}}
                   />
                   {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-600/50">
                          <h4 className="text-xs font-bold mb-2">Sources:</h4>
                          <ul className="space-y-1">
                              {message.sources.map((source, i) => (
                                  <li key={i}>
                                      <a 
                                        href={source.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-xs text-cyan-400 hover:underline flex items-start gap-1.5"
                                      >
                                        <Link size={12} className="flex-shrink-0 mt-0.5" />
                                        <span className="truncate">{source.title || new URL(source.uri).hostname}</span>
                                      </a>
                                  </li>
                              ))}
                          </ul>
                      </div>
                   )}
                </div>
              </div>
            ))}
             {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-gray-800 text-gray-300 flex items-center gap-2">
                   <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-0"></span>
                   <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></span>
                   <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700/50 flex-shrink-0">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask a question..."
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-4 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/50 transition-colors duration-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00AEEF] disabled:text-gray-600 transition-colors"
                disabled={isLoading || !userInput.trim()}
                aria-label="Send message"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
              </button>
            </div>
          </form>
          <style>{`
            .prose a { color: #22d3ee; }
            .prose p { margin: 0; }
            .prose ul, .prose ol { margin: 0.5rem 0 0 0; }
          `}</style>
        </div>
      )}
    </>
  );
};

export default ChatBot;