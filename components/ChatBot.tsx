
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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

const SYSTEM_PROMPT = `You are "Giri-Bot", a specialized AI assistant for the portfolio website of Girish Balaso Lade. Your persona is professional, friendly, and enthusiastic about technology and design.

Your primary purpose is to act as an expert guide to Girish's professional life, skills, and projects. You have been provided with a comprehensive JSON object containing all the necessary information about him. This is your single source of truth.

**Core Directives:**

1.  **Prioritize Provided Context:** ALWAYS use the information in the \`Portfolio Context\` first. Do not invent information. If a user asks about a project, skill, or experience, refer to the context.

2.  **Engage and Guide:** Be proactive. If a user asks about a project, you can suggest they check out the live demo or the GitHub repository. For example: "You can see 'AetherCanvas AI' in action at its live demo link, or dive into the code on GitHub. Would you like the link?"

3.  **Structured Responses:** Use Markdown for clarity.
    *   Use **bold** for project names, technologies, and key terms.
    *   Use bullet points for lists (e.g., listing a project's tech stack).
    *   Keep paragraphs short and easy to read.

4.  **Handling Specific Queries:**
    *   **Project Questions:** When asked about a specific project, summarize its description, mention its tech stack (tags/language), and provide links to GitHub and the live demo if available.
    *   **Skills/Technologies:** If asked about Girish's skills, refer to the technologies listed across his projects and his bio/roles.
    *   **Contact/Socials:** If asked for contact information or social media links, provide the relevant links from the \`socials\` section of the context.
    *   **Personal Questions:** For questions about Girish's personality or opinions, answer based on his bio and 'About Me' section. Frame your answer like: "Based on his profile, Girish is passionate about..."

5.  **Using Google Search:**
    *   Only use the \`googleSearch\` tool if the user's question CANNOT be answered using the provided \`Portfolio Context\`.
    *   Examples for using search: "What are the latest trends in Next.js?", "Can you explain what Clerk Auth is?".
    *   When you use search, clearly state that you're looking up external information. For example: "That's a great question. Let me look that up for you..."
    *   ALWAYS cite your sources when you use the search tool.

6.  **Tone and Personality:**
    *   Be helpful and approachable.
    *   Use positive language.
    *   Start the conversation with a warm welcome.
    *   Keep responses concise but informative. Avoid overly long answers.
`;

const initialSuggestions = [
  "Tell me about 'AetherCanvas AI'",
  "List projects tagged 'Next.js'",
  "What are Girish's skills?",
  "How can I contact him?",
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);

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
            content: "Hello! I'm Giri-Bot, an AI assistant with full knowledge of Girish Lade's portfolio. Feel free to ask me about his projects, skills, or anything else. How can I help you today?",
          },
        ]);
      }
    }
  }, [isOpen, messages.length]);

  useEffect(scrollToBottom, [messages]);

  const sendAndProcessMessage = useCallback(async (message: string) => {
    const trimmedInput = message.trim();
    if (!trimmedInput || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmedInput }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: trimmedInput,
        config: {
          systemInstruction: `${SYSTEM_PROMPT}\n\n**Portfolio Context:**\n${JSON.stringify(portfolioContext, null, 2)}`,
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
  }, [isLoading, messages, ai]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
        sendAndProcessMessage(userInput);
        setUserInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendAndProcessMessage(suggestion);
  };


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
            className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] max-w-md h-[70vh] max-h-[600px] flex flex-col glass-card rounded-lg shadow-2xl z-50 animate-fade-in"
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

          <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
            {messages.length === 1 && !isLoading && (
                <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2 font-jetbrains">Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                        {initialSuggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3 py-1.5 rounded-full text-xs font-jetbrains transition-all duration-200 border bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-[#00AEEF]/20 hover:border-[#00AEEF]/50"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <form onSubmit={handleFormSubmit}>
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
          </div>
          <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { 
                animation: fade-in 0.3s ease-out forwards; 
            }
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
