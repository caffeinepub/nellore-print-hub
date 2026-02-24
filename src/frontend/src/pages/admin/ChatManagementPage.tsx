import { useState } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAllChatMessages, useOwnerReply } from '../../hooks/useChat';
import { toast } from 'sonner';
import AdminGuard from '../../components/AdminGuard';
import { ChatMessage } from '../../backend';

function ChatManagementContent() {
  const { data: messages = [], isLoading } = useAllChatMessages();
  const ownerReplyMutation = useOwnerReply();
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());

  // Group messages by customer email
  const groupedMessages = messages.reduce((acc, msg) => {
    const key = msg.senderEmail;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(msg);
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  const handleReply = async (messageId: string, customerEmail: string) => {
    const replyText = replyTexts[messageId];
    if (!replyText?.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      await ownerReplyMutation.mutateAsync({
        replyToMessageId: messageId,
        replyText,
      });
      setReplyTexts({ ...replyTexts, [messageId]: '' });
      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const toggleCustomer = (email: string) => {
    const newExpanded = new Set(expandedCustomers);
    if (newExpanded.has(email)) {
      newExpanded.delete(email);
    } else {
      newExpanded.add(email);
    }
    setExpandedCustomers(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chat Management</h1>
        <p className="text-muted-foreground">View and respond to customer messages</p>
      </div>

      {Object.keys(groupedMessages).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No customer messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedMessages).map(([email, customerMessages]) => {
            const isExpanded = expandedCustomers.has(email);
            const latestMessage = customerMessages[0];
            const customerName = latestMessage.senderName;

            return (
              <Card key={email}>
                <CardHeader
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => toggleCustomer(email)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{customerName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {customerMessages.length} message{customerMessages.length !== 1 ? 's' : ''}
                      </span>
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {customerMessages
                          .sort((a, b) => Number(a.timestamp - b.timestamp))
                          .map((msg) => (
                            <div key={msg.id} className="space-y-3">
                              <div
                                className={`p-4 rounded-lg ${
                                  msg.senderIsOwner
                                    ? 'bg-primary/10 ml-8'
                                    : 'bg-accent/50 mr-8'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs font-semibold text-primary">
                                    {msg.senderIsOwner ? 'You (Owner)' : msg.senderName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(Number(msg.timestamp) / 1000000).toLocaleString()}
                                  </p>
                                </div>
                                <p className="text-sm">{msg.messageText}</p>
                              </div>

                              {!msg.senderIsOwner && !msg.replyToMessageId && (
                                <div className="ml-8 space-y-2">
                                  <Textarea
                                    placeholder="Type your reply..."
                                    value={replyTexts[msg.id] || ''}
                                    onChange={(e) =>
                                      setReplyTexts({ ...replyTexts, [msg.id]: e.target.value })
                                    }
                                    rows={3}
                                    className="resize-none"
                                  />
                                  <Button
                                    onClick={() => handleReply(msg.id, email)}
                                    disabled={
                                      ownerReplyMutation.isPending || !replyTexts[msg.id]?.trim()
                                    }
                                    size="sm"
                                  >
                                    {ownerReplyMutation.isPending ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Reply
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ChatManagementPage() {
  return (
    <AdminGuard>
      <ChatManagementContent />
    </AdminGuard>
  );
}
