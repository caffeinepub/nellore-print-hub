import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSendMessage, useGetChatsForCustomer } from '../hooks/useChat';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { toast } from 'sonner';
import { haptics } from '../utils/haptics';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../translations';

interface ChatWidgetProps {
  onClose: () => void;
}

export default function ChatWidget({ onClose }: ChatWidgetProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = getTranslations(language);

  const isAuthenticated = !!identity;

  const email = userProfile?.email || senderEmail;
  const { data: chatMessages = [], refetch } = useGetChatsForCustomer(email, !!email);
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage();

  useEffect(() => {
    if (userProfile) {
      setSenderName(userProfile.name);
      setSenderEmail(userProfile.email);
    }
  }, [userProfile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!senderName.trim()) {
      toast.error(t.chat.errorName);
      return;
    }
    if (!senderEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      toast.error(t.chat.errorEmail);
      return;
    }

    try {
      haptics.tap();
      await sendMessage({ senderName: senderName.trim(), senderEmail: senderEmail.trim(), messageText: message.trim() });
      setMessage('');
      toast.success(t.chat.messageSent);
      refetch();
    } catch {
      haptics.error();
      toast.error('Failed to send message.');
    }
  };

  const sortedMessages = [...chatMessages].sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background md:inset-auto md:bottom-4 md:right-4 md:w-96 md:h-[600px] md:rounded-2xl md:shadow-2xl md:border md:border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground md:rounded-t-2xl">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">{t.chat.title}</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
          <MessageCircle className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">{t.chat.loginPrompt}</p>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sortedMessages.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">{t.chat.noMessages}</p>
            ) : (
              sortedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderIsOwner ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.senderIsOwner
                        ? 'bg-muted text-foreground rounded-tl-sm'
                        : 'bg-primary text-primary-foreground rounded-tr-sm'
                    }`}
                  >
                    <p className="font-medium text-xs mb-0.5 opacity-70">
                      {msg.senderIsOwner ? t.chat.owner : t.chat.you}
                    </p>
                    <p>{msg.messageText}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.chat.messagePlaceholder}
              className="flex-1 h-10"
              disabled={isSending}
            />
            <Button type="submit" size="icon" disabled={isSending || !message.trim()} className="h-10 w-10 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
