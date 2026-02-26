import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { QuotationRequest, QuotationDetails, ServiceType, ExternalBlob } from '../backend';

export function useGetAllQuotations() {
  const { actor, isFetching } = useActor();

  return useQuery<QuotationRequest[]>({
    queryKey: ['allQuotations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllQuotations();
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
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
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetQuotationDetails(quotationId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<QuotationDetails | null>({
    queryKey: ['quotationDetails', quotationId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getQuotationDetails(quotationId);
    },
    enabled: !!actor && !isFetching && !!quotationId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateQuotation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<
    string,
    Error,
    {
      serviceType: ServiceType;
      deadline: bigint;
      projectDetails: string;
      mobileNumber: string;
      email: string;
      file: ExternalBlob | null;
    }
  >({
    mutationFn: async ({ serviceType, deadline, projectDetails, mobileNumber, email, file }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createQuotationRequest(serviceType, deadline, projectDetails, mobileNumber, email, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myQuotations'] });
      queryClient.invalidateQueries({ queryKey: ['allQuotations'] });
    },
  });
}

export function useAddQuotationDetails() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { quotationId: string; price: bigint; description: string; terms: string }
  >({
    mutationFn: async ({ quotationId, price, description, terms }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addQuotationDetails(quotationId, price, description, terms);
    },
    onSuccess: (_, { quotationId }) => {
      queryClient.invalidateQueries({ queryKey: ['quotationDetails', quotationId] });
      queryClient.invalidateQueries({ queryKey: ['allQuotations'] });
    },
  });
}

export function useApproveQuotation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (quotationId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveQuotation(quotationId);
    },
    onSuccess: (_, quotationId) => {
      queryClient.invalidateQueries({ queryKey: ['quotationDetails', quotationId] });
      queryClient.invalidateQueries({ queryKey: ['allQuotations'] });
    },
  });
}

export function useMarkQuotationCustomerPending() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (quotationId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markQuotationCustomerPending(quotationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allQuotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotationStatistics'] });
    },
  });
}

export function useCustomerApproveQuotation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (quotationId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.customerApproveQuotation(quotationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myQuotations'] });
      queryClient.invalidateQueries({ queryKey: ['allQuotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotationStatistics'] });
    },
  });
}

export function useAdminAcceptPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (quotationId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminAcceptPayment(quotationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allQuotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotationStatistics'] });
    },
  });
}

export function useGetOverdueQuotations() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['overdueQuotations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingQuotationsOlderThan1Hour();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });
}
