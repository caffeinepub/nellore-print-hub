import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ServiceType, QuotationRequest, QuotationDetails } from '../backend';

export function useGetAllQuotations() {
  const { actor, isFetching } = useActor();

  return useQuery<QuotationRequest[]>({
    queryKey: ['quotations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllQuotations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyQuotations() {
  const { actor, isFetching } = useActor();

  return useQuery<QuotationRequest[]>({
    queryKey: ['myQuotations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyQuotations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetQuotationDetails() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (quotationId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getQuotationDetails(quotationId);
    },
  });
}

export function useCreateQuotation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      serviceType: ServiceType;
      deadline: bigint;
      projectDetails: string;
      mobileNumber: string;
      email: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createQuotationRequest(
        data.serviceType,
        data.deadline,
        data.projectDetails,
        data.mobileNumber,
        data.email
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
}

export function useAddQuotationDetails() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      quotationId: string;
      price: bigint;
      description: string;
      terms: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addQuotationDetails(data.quotationId, data.price, data.description, data.terms);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
}

export function useApproveQuotation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quotationId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveQuotation(quotationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotationStatistics'] });
    },
  });
}
