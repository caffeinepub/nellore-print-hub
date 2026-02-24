import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSendMessage } from '../hooks/useChat';
import { toast } from 'sonner';
import { haptics } from '../utils/haptics';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [hasSetProfile, setHasSetProfile] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string; timestamp: number }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    const savedName = localStorage.getItem('chatName');
    const savedEmail = localStorage.getItem('chatEmail');
    if (savedName && savedEmail) {
      setName(savedName);
      setEmail(savedEmail);
      setHasSetProfile(true);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (!hasSetProfile) {
      if (!name.trim() || !email.trim()) {
        toast.error('Please enter your name and email');
        return;
      }
      localStorage.setItem('chatName', name);
      localStorage.setItem('chatEmail', email);
      setHasSetProfile(true);
    }

    try {
      await sendMessageMutation.mutateAsync({
        senderName: name,
        senderEmail: email,
        messageText: message,
      });

      setChatHistory([...chatHistory, { sender: name, text: message, timestamp: Date.now() }]);
      setMessage('');
      haptics.success();
      toast.success('Message sent successfully');
    } catch (error) {
      haptics.error();
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  const handleClose = () => {
    haptics.tap();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-background/95 backdrop-blur-lg">
        <Button variant="ghost" size="icon" onClick={handleClose} className="min-w-[44px] min-h-[44px]">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">Chat with us</h2>
          <p className="text-xs text-muted-foreground">We typically reply within minutes</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="space-y-4">
          {!hasSetProfile && (
            <div className="bg-primary/10 rounded-2xl p-4 max-w-[85%]">
              <p className="text-sm">
                Hi! Welcome to Nellore Print Hub. Please introduce yourself to start chatting.
              </p>
            </div>
          )}
          {chatHistory.map((msg, idx) => (
            <div key={idx} className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-4 max-w-[85%]">
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4 space-y-3 safe-area-bottom">
        {!hasSetProfile ? (
          <>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-12 text-base"
              inputMode="text"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="h-12 text-base"
              inputMode="email"
            />
          </>
        ) : null}
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 resize-none min-h-[48px] text-base"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending}
            size="icon"
            className="min-w-[48px] min-h-[48px] rounded-full"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
