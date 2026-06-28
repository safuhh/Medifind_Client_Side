"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendFamilyChat } from "@/services/apis/familyChat.api";
import { toast } from "react-toastify";
import {
  Send, Brain, Loader2, User, Bot, Copy, ChevronRight,
  FileText, Calendar, ShoppingBag, Heart, ArrowDown
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: { sourceCollection: string; sourceId: string; excerpt: string }[];
  suggestedFollowUps?: string[];
  timestamp: Date;
}

const SOURCE_ICONS: Record<string, any> = {
  healthReport: FileText,
  booking: Calendar,
  order: ShoppingBag,
  familyMember: Heart,
  searchHistory: Brain,
};

const SOURCE_LABELS: Record<string, string> = {
  healthReport: "Health Report",
  booking: "Appointment",
  order: "Medicine Order",
  familyMember: "Profile",
  searchHistory: "Medicine Search",
};

const QUICK_PROMPTS = [
  "What medicines is this person currently taking?",
  "When is the next appointment?",
  "Summarize the latest health report.",
  "Are there any pending prescription refills?",
  "What chronic conditions are recorded?",
];

interface Props {
  activeMember: any | null;
}

export default function FamilyAIChat({ activeMember }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  // Reset chat when family member changes
  useEffect(() => {
    setMessages([]);
    setSessionId(undefined);
    setIsUserScrolledUp(false);
  }, [activeMember?._id]);

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    }
    setIsUserScrolledUp(false);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      // If user is more than 50px away from the bottom, they are considered scrolled up
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 50;
      setIsUserScrolledUp(isScrolledUp);
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || loading) return;

    setInput("");
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    const userMsg: Message = { role: "user", content: messageText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await sendFamilyChat({
        message: messageText,
        familyMemberId: activeMember?._id,
        sessionId,
      });

      if (res.data?.success) {
        const { reply, citations, sessionId: newSid, suggestedFollowUps } = res.data;
        if (newSid) setSessionId(newSid);
        const assistantMsg: Message = {
          role: "assistant",
          content: reply,
          citations,
          suggestedFollowUps,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "AI response failed. Please try again.");
      setMessages((prev) => prev.slice(0, -1)); // remove failed user message
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[550px]">
      {/* Header */}
      
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-[#0a4d33] to-emerald-500 rounded-xl flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">MediFind AI</p>
          <p className="text-xs text-slate-400">
            {activeMember ? `Asking about ${activeMember.name}` : "Select a family member to focus"}
          </p>
        </div>
       
      </div>
    

      {/* Messages */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-5 space-y-5 relative scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl flex items-center justify-center">
              <Brain className="w-10 h-10 text-emerald-600" />
            </div>
              <br/>
         
            <div className="text-center max-w-sm">
              <h3 className="text-base font-bold text-slate-800 mb-2">
                {activeMember ? `Ask about ${activeMember.name}'s health` : "Select a family member to start"}
              </h3>
              <p className="text-sm text-slate-400">
                I answer using only your actual MediFind records — prescriptions, appointments, orders, and health reports.
              </p>
            </div>
            {activeMember && (
              <div className="w-full grid grid-cols-1 gap-2">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="text-left text-sm text-slate-600 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 px-4 py-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 flex-shrink-0" />
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-br from-[#0a4d33] to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                <div
                  className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#0a4d33] to-emerald-600 text-white rounded-tr-sm shadow-emerald-900/10"
                      : "bg-white text-slate-700 rounded-tl-sm border border-slate-100/80 shadow-slate-200/40"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Citations */}
                {msg.role === "assistant" && msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.slice(0, 3).map((c, ci) => {
                      const Icon = SOURCE_ICONS[c.sourceCollection] || FileText;
                      return (
                        <div
                          key={ci}
                          className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-1 rounded-lg"
                        >
                          <Icon className="w-3 h-3" />
                          {SOURCE_LABELS[c.sourceCollection] || c.sourceCollection}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {msg.role === "assistant" && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="flex flex-col gap-1.5 w-full">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">You might also ask:</p>
                    {msg.suggestedFollowUps.map((q, qi) => (
                      <button
                        key={qi}
                        onClick={() => sendMessage(q)}
                        className="text-left text-xs text-slate-600 bg-white hover:bg-emerald-50 hover:text-emerald-700 px-3 py-2 rounded-lg border border-slate-100 hover:border-emerald-200 transition-all flex items-center gap-2 group"
                      >
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-500" />
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Copy & time */}
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(msg.content)}
                      className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      <Copy className="w-3 h-3 text-slate-400" />
                    </button>
                    <span className="text-[10px] text-slate-300">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
              )}
            </motion.div>
          ))
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#0a4d33] to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white shadow-md border border-emerald-100/50 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-2 max-w-[80%]">
              <span className="text-sm font-medium text-emerald-700">MediFind AI is thinking</span>
              <div className="flex space-x-1.5 ml-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Jump to bottom button */}
      <AnimatePresence>
        {isUserScrolledUp && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-28 left-0 right-0 flex justify-center pointer-events-none z-10"
          >
            <button
              onClick={scrollToBottom}
              className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg px-4 py-2 rounded-full text-xs font-bold text-[#0a4d33] hover:bg-emerald-50 transition-all hover:-translate-y-0.5"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              New Messages
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 rounded-b-2xl shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.02)] relative z-20">
        {!activeMember && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3 text-center">
            Please select a family member from the left panel to start chatting.
          </p>
        )}
        <div className="flex gap-3 items-end bg-slate-50 border border-slate-200 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-2 transition-all duration-300 focus-within:bg-white focus-within:shadow-[0_8px_24px_-8px_rgba(10,77,51,0.12)] focus-within:border-emerald-200 focus-within:ring-4 focus-within:ring-emerald-50 group">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!activeMember || loading}
            placeholder={
              activeMember
                ? `Ask about ${activeMember.name}'s health...`
                : "Select a family member first..."
            }
            rows={1}
            className="flex-1 resize-none text-[15px] text-slate-800 bg-transparent border-none px-4 py-3 focus:outline-none focus:ring-0 placeholder-slate-400 disabled:opacity-50 max-h-40 min-h-[52px] scrollbar-thin scrollbar-thumb-slate-200 leading-relaxed"
            onInput={(e: any) => {
              const scrollContainer = scrollContainerRef.current;
              const prevScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
              
              e.target.style.height = "52px";
              e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
              
              if (scrollContainer) {
                scrollContainer.scrollTop = prevScrollTop;
              }
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || !activeMember || loading}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 mb-0.5 ${
              input.trim() && activeMember && !loading
                ? "bg-gradient-to-br from-[#0a4d33] to-emerald-600 text-white shadow-md hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 px-1">
           <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
             Secure & Private AI Assistant
           </p>
           <p className="text-[10px] text-slate-400">
             <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200 text-[9px] mr-1">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200 text-[9px] mr-1">Shift+Enter</kbd> for new line
           </p>
        </div>
      </div>
    </div>
  );
}
