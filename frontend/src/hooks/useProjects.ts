import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ServiceType, Project } from '../backend';

export function useGetAllProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetProjectsByCategory(category: ServiceType, enabled: boolean = true) {
  const { actor, isFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['projects', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjectsByCategory(category);
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAddProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      imageUrl: string;
      title: string;
      description: string;
      category: ServiceType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProject(data.imageUrl, data.title, data.description, data.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useEditProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectId: string;
      imageUrl: string;
      title: string;
      description: string;
      category: ServiceType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editProject(data.projectId, data.imageUrl, data.title, data.description, data.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
