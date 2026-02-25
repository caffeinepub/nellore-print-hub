import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ChatMessage } from '../backend';

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      senderName: string;
      senderEmail: string;
      messageText: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(data.senderName, data.senderEmail, data.messageText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      queryClient.invalidateQueries({ queryKey: ['customerChatHistory'] });
      queryClient.invalidateQueries({ queryKey: ['chatsForCustomer'] });
    },
  });
}

export function useAllChatMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChatMessages();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useOwnerReply() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { replyToMessageId: string; replyText: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.ownerReply(data.replyToMessageId, data.replyText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      queryClient.invalidateQueries({ queryKey: ['customerChatHistory'] });
    },
  });
}

export function useCustomerChatHistory(senderEmail: string) {
  const { actor, isFetching } = useActor();

  return useQuery<{ messages: ChatMessage[]; replies: ChatMessage[] }>({
    queryKey: ['customerChatHistory', senderEmail],
    queryFn: async () => {
      if (!actor) return { messages: [], replies: [] };
      return actor.getCustomerChatHistory(senderEmail);
    },
    enabled: !!actor && !isFetching && !!senderEmail,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useGetChatsForCustomer(senderEmail: string, enabled: boolean = true) {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatsForCustomer', senderEmail],
    queryFn: async () => {
      if (!actor || !senderEmail) return [];
      return actor.getChatsForCustomer(senderEmail);
    },
    enabled: !!actor && !isFetching && !!senderEmail && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
