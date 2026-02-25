import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSendMessage } from '../hooks/useChat';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { haptics } from '../utils/haptics';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [hasSetProfile, setHasSetProfile] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string; timestamp: number }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = useSendMessage();
  const isAuthenticated = !!identity;

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
      toast.success('Message sent successfully!');
    } catch (error: any) {
      haptics.error();
      toast.error(error.message || 'Failed to send message. Please try again.');
    }
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
          <h2 className="text-lg font-semibold">Chat with Us</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <Alert className="max-w-md">
            <LogIn className="h-5 w-5" />
            <AlertTitle>Sign in Required</AlertTitle>
            <AlertDescription className="mt-2">
              Please sign in to start a conversation with us.
            </AlertDescription>
            <div className="mt-4">
              <Button onClick={login} disabled={loginStatus === 'logging-in'} className="w-full">
                {loginStatus === 'logging-in' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
        <h2 className="text-lg font-semibold">Chat with Us</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
          aria-label="Close chat"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {!hasSetProfile ? (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Welcome!</h3>
              <p className="text-sm text-muted-foreground">
                Please introduce yourself before starting the conversation
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="chat-name" className="text-sm font-medium">
                Your Name
              </label>
              <Input
                id="chat-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="chat-email" className="text-sm font-medium">
                Your Email
              </label>
              <Input
                id="chat-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Start a conversation with us!</p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div key={idx} className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t bg-muted/30">
        <div className="flex gap-2">
          <Textarea
            placeholder={hasSetProfile ? 'Type your message...' : 'Fill in your details above first'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-[48px] max-h-32 resize-none"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || !message.trim()}
            size="icon"
            className="h-12 w-12 flex-shrink-0"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
