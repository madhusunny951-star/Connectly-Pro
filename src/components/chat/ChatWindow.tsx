import React, { useState, useEffect, useRef } from 'react';
import { Match, Message } from '../../types.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  Send, Smile, Image as ImageIcon, MoreVertical, ShieldAlert, 
  Ban, UserX, Check, CheckCheck, Clock, ArrowLeft, CheckCircle2,
  Sparkles, Heart
} from 'lucide-react';

interface ChatWindowProps {
  match: Match;
  onBack?: () => void;
  onUnmatched?: () => void;
}

const EMOJI_LIST = ['❤️', '😊', '✨', '☕', '👋', '🎉', '🔥', '🍷', '🍕', '😂'];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  match,
  onBack,
  onUnmatched
}) => {
  const { user, openProfileModal, openReportModal, refreshCounts } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmUnmatch, setConfirmUnmatch] = useState<boolean>(false);
  const [confirmBlock, setConfirmBlock] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const otherUser = match.other_user;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getMessages(match.id)
      .then(res => {
        if (isMounted) {
          setMessages(res);
          scrollToBottom();
          // Mark as read
          api.markMessagesRead(match.id).then(() => refreshCounts()).catch(() => {});
        }
      })
      .catch(err => console.error('Error fetching chat messages:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [match.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    // Optimistic message
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      match_id: match.id,
      sender_id: user?.id || 'usr_me',
      message: trimmed,
      message_type: 'text',
      created_at: new Date().toISOString(),
      read_at: null,
      status: 'sending'
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setInputText('');
    setIsEmojiPickerOpen(false);

    try {
      const created = await api.sendMessage(match.id, trimmed);
      setMessages(prev => prev.map(m => m.id === tempId ? created : m));
      refreshCounts();

      // Simulate a conversational automated reply after 2.5s for demonstration
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(async () => {
          setIsTyping(false);
          // Refresh messages from server
          try {
            const replies = [
              "That sounds great! I'm really looking forward to getting to know you better.",
              "Haha, completely agree with that! What else do you enjoy doing during the weekend?",
              "That's so interesting! Tell me more about that 😊",
              "I was just thinking the exact same thing! Coffee date definitely sounds wonderful."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            // Post message as otherUser
            const autoMsg: Message = {
              id: `reply_${Date.now()}`,
              match_id: match.id,
              sender_id: otherUser?.id || 'usr_other',
              message: randomReply,
              message_type: 'text',
              created_at: new Date().toISOString(),
              read_at: null,
              status: 'delivered'
            };
            setMessages(prev => [...prev, autoMsg]);
          } catch {}
        }, 2200);
      }, 1500);

    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
    }
  };

  const handleUnmatch = async () => {
    try {
      await api.unmatch(match.id);
      if (onUnmatched) onUnmatched();
    } catch (e) {
      console.error(e);
    }
  };

  const handleBlock = async () => {
    if (!otherUser) return;
    try {
      await api.blockUser(otherUser.id);
      if (onUnmatched) onUnmatched();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white/45 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 shadow-lg">
      
      {/* Chat Header */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-white/40 flex items-center justify-between bg-white/30 backdrop-blur-md sticky top-0 z-20">
        
        {/* Left: Back button (mobile) + Avatar + Online status */}
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white/60"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div 
            className="relative cursor-pointer"
            onClick={() => otherUser && openProfileModal(otherUser.id)}
          >
            <img
              src={otherUser?.photos[0]?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={otherUser?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/80 shadow-xs"
            />
            {otherUser?.is_online ? (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
            ) : (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 border-2 border-white rounded-full shadow-xs" />
            )}
          </div>

          <div 
            className="cursor-pointer"
            onClick={() => otherUser && openProfileModal(otherUser.id)}
          >
            <div className="flex items-center space-x-1.5">
              <h3 className="text-sm font-bold text-slate-900 hover:text-rose-600 transition-colors">
                {otherUser?.name}
              </h3>
              {otherUser?.is_verified && (
                <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-white shadow-xs" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              {otherUser?.is_online ? (
                <span className="text-emerald-600 font-medium">Online now</span>
              ) : (
                <span>{otherUser?.last_active || 'Last seen recently'}</span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Compatibility score & Safety Options Dropdown */}
        <div className="flex items-center space-x-2">
          {otherUser?.match_score && (
            <span className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/60 text-rose-600 border border-white/80 shadow-xs">
              <Sparkles className="w-3 h-3 text-rose-500" />
              <span>{otherUser.match_score}% Match</span>
            </span>
          )}

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white/85 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/60 py-1.5 z-30 animate-in fade-in slide-in-from-top-2 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (otherUser) openProfileModal(otherUser.id);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700"
                >
                  View Profile
                </button>

                <div className="border-t border-neutral-100 my-1" />

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setConfirmUnmatch(true);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 flex items-center space-x-2"
                >
                  <UserX className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Unmatch User</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (otherUser) openReportModal(otherUser.id);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 text-amber-700 flex items-center space-x-2"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>Report User</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setConfirmBlock(true);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 flex items-center space-x-2"
                >
                  <Ban className="w-3.5 h-3.5 text-rose-500" />
                  <span>Block User</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unmatch Confirmation Banner */}
      {confirmUnmatch && (
        <div className="p-3 bg-neutral-100 border-b border-neutral-200 text-xs flex items-center justify-between text-neutral-700">
          <span>Are you sure you want to unmatch? This conversation will be removed.</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUnmatch}
              className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700"
            >
              Unmatch
            </button>
            <button
              onClick={() => setConfirmUnmatch(false)}
              className="px-2 py-1 bg-white border border-neutral-300 rounded-lg text-neutral-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Block Confirmation Banner */}
      {confirmBlock && (
        <div className="p-3 bg-rose-50 border-b border-rose-200 text-xs flex items-center justify-between text-rose-800">
          <span>Block user? They will not be able to message you or view your profile.</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBlock}
              className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700"
            >
              Block
            </button>
            <button
              onClick={() => setConfirmBlock(false)}
              className="px-2 py-1 bg-white border border-neutral-300 rounded-lg text-neutral-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Message List Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white/20 backdrop-blur-xs">
        
        {/* Icebreaker Header */}
        <div className="text-center py-6 border-b border-white/30 mb-4 max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-md text-rose-500 flex items-center justify-center mx-auto mb-2.5 border border-white/80 shadow-md">
            <Heart className="w-7 h-7 fill-rose-500/20" />
          </div>
          <p className="text-xs font-semibold text-slate-800">
            You and {otherUser?.name} matched!
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Only mutual matches can message each other. Respect each other and stay safe.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="w-48 h-10 bg-white/50 backdrop-blur-md rounded-2xl animate-pulse" />
            <div className="w-56 h-12 bg-white/50 backdrop-blur-md rounded-2xl animate-pulse ml-auto" />
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_id === user?.id || msg.sender_id === 'usr_me';
            const timeStr = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-br-xs shadow-md shadow-rose-200/50'
                      : 'bg-white/80 backdrop-blur-md text-slate-800 rounded-bl-xs border border-white/80 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                </div>

                {/* Timestamp and Read Status */}
                <div className="flex items-center space-x-1 mt-1 px-1 text-[10px] text-slate-400">
                  <span>{timeStr}</span>
                  {isMe && (
                    <span>
                      {msg.status === 'sending' && <Clock className="w-3 h-3 text-slate-400 inline" />}
                      {msg.status === 'sent' && <Check className="w-3 h-3 text-slate-400 inline" />}
                      {msg.status === 'delivered' && <CheckCheck className="w-3 h-3 text-slate-400 inline" />}
                      {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500 inline" />}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs py-1">
            <div className="flex space-x-1 bg-white/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/80 shadow-xs">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[11px] italic text-slate-500">{otherUser?.name} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Bar Picker */}
      {isEmojiPickerOpen && (
        <div className="px-4 py-2 bg-white/40 backdrop-blur-md border-t border-white/40 flex items-center space-x-2 overflow-x-auto">
          {EMOJI_LIST.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setInputText(prev => prev + emoji)}
              className="text-lg hover:scale-125 transition-transform p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 bg-white/35 backdrop-blur-md border-t border-white/40 flex items-center space-x-2"
      >
        <button
          type="button"
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-white/60 transition-colors"
          title="Emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setInputText(prev => prev + ' 📸 [Photo shared]')}
          className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-white/60 transition-colors"
          title="Attach photo"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${otherUser?.name || 'match'}...`}
          className="flex-1 text-xs sm:text-sm py-2.5 px-4 rounded-2xl bg-white/60 focus:bg-white/90 border border-white/60 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none backdrop-blur-md transition-all text-slate-800 placeholder:text-slate-400 shadow-xs"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white disabled:opacity-40 shadow-md shadow-rose-200 transition-all flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
