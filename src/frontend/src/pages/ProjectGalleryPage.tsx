import { useState } from 'react';
import { useGetAllProjects } from '../hooks/useProjects';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServiceType } from '../backend';
import SwipeContainer from '../components/SwipeContainer';
import PullToRefreshContainer from '../components/PullToRefreshContainer';
import SkeletonCard from '../components/SkeletonCard';
import { useQueryClient } from '@tanstack/react-query';

export default function ProjectGalleryPage() {
  const { data: projects, isLoading } = useGetAllProjects();
  const [selectedCategory, setSelectedCategory] = useState<ServiceType | 'all'>('all');
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  const categories = [
    { value: 'all' as const, label: 'All Projects' },
    { value: ServiceType.digital, label: 'Digital' },
    { value: ServiceType.banner, label: 'Banners' },
    { value: ServiceType.offset, label: 'Offset' },
    { value: ServiceType.design, label: 'Design' },
  ];

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects?.filter((p) => p.category === selectedCategory);

  return (
    <PullToRefreshContainer onRefresh={handleRefresh}>
      <SwipeContainer>
        <div className="flex flex-col">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-16 px-4">
            <div className="container text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                Project <span className="text-primary">Gallery</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore our portfolio of successful printing projects
              </p>
            </div>
          </section>

          {/* Category Filter */}
          <section className="sticky top-14 z-30 bg-background/95 backdrop-blur-lg border-b border-border py-3 px-4">
            <div className="container">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat.value)}
                    className="whitespace-nowrap min-h-[44px] px-6 text-base"
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Projects Grid */}
          <section className="py-8 md:py-12 px-4">
            <div className="container">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {[...Array(6)].map((_, idx) => (
                    <SkeletonCard key={idx} variant="project" />
                  ))}
                </div>
              ) : filteredProjects && filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-all">
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6 space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="pt-2">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                            {project.category}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No projects found in this category</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </SwipeContainer>
    </PullToRefreshContainer>
  );
}
