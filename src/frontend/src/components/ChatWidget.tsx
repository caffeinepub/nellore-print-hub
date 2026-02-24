import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSendMessage } from '../hooks/useChat';
import { toast } from 'sonner';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Open chat"
        >
          <img
            src="/assets/generated/chat-icon.dim_64x64.png"
            alt="Chat"
            className="w-8 h-8"
          />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] shadow-2xl flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-lg font-semibold">Chat with Us</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
            {!hasSetProfile ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Please introduce yourself to start chatting
                </p>
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
                <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
                  <div className="space-y-3">
                    {chatHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No messages yet. Start a conversation!
                      </p>
                    ) : (
                      chatHistory.map((msg, idx) => (
                        <div
                          key={idx}
                          className="bg-accent/50 rounded-lg p-3 space-y-1"
                        >
                          <p className="text-xs font-semibold text-primary">{msg.sender}</p>
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="space-y-2">
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={3}
                className="resize-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending || !message.trim()}
                className="w-full"
              >
                {sendMessageMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
