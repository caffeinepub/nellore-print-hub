import { NegotiationMessage } from '../backend';
import { MessageSquare, User, Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NegotiationHistoryProps {
  negotiationHistory: NegotiationMessage[];
}

export default function NegotiationHistory({ negotiationHistory }: NegotiationHistoryProps) {
  if (negotiationHistory.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Negotiation History
      </h4>
      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {negotiationHistory.map((msg, index) => {
            const isCustomer = msg.sender === 'customer';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isCustomer ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCustomer ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {isCustomer ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </div>
                <div className={`flex-1 ${isCustomer ? 'text-left' : 'text-right'}`}>
                  <div
                    className={`inline-block max-w-[80%] rounded-lg p-3 ${
                      isCustomer
                        ? 'bg-primary/10 text-foreground'
                        : 'bg-secondary/50 text-foreground'
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">
                      {isCustomer ? 'You' : 'Admin'}
                    </p>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(Number(msg.timestamp) / 1000000).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
