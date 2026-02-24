import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ServiceType, Review } from '../backend';

export function useGetAllReviews() {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReviewsByRating(rating: bigint, enabled: boolean = true) {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews', rating.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviewsByRating(rating);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      reviewText: string;
      rating: bigint;
      imageUrl: string | null;
      projectType: ServiceType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReview(
        data.customerName,
        data.reviewText,
        data.rating,
        data.imageUrl,
        data.projectType
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
