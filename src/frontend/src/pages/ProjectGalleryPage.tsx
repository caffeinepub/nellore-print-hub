import { useState } from 'react';
import { useGetAllProjects, useGetProjectsByCategory } from '../hooks/useProjects';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon } from 'lucide-react';
import { ServiceType } from '../backend';
import { ExternalBlob } from '../lib/blobStorage';

export default function ProjectGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceType | 'all'>('all');
  
  const { data: allProjects, isLoading: allLoading } = useGetAllProjects();
  const { data: filteredProjects, isLoading: filteredLoading } = useGetProjectsByCategory(
    selectedCategory as ServiceType,
    selectedCategory !== 'all'
  );

  const projects = selectedCategory === 'all' ? allProjects : filteredProjects;
  const isLoading = selectedCategory === 'all' ? allLoading : filteredLoading;

  const categoryLabels: Record<ServiceType | 'all', string> = {
    all: 'All Projects',
    digital: 'Digital Printing',
    banner: 'Flex & Banners',
    offset: 'Offset Printing',
    design: 'Design Services',
  };

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Project <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our latest work and see the quality we deliver
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Our Work</h2>
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ServiceType | 'all')}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="digital">Digital Printing</SelectItem>
                <SelectItem value="banner">Flex & Banners</SelectItem>
                <SelectItem value="offset">Offset Printing</SelectItem>
                <SelectItem value="design">Design Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="pt-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const imageUrl = ExternalBlob.fromURL(project.imageUrl).getDirectURL();
                return (
                  <Card key={project.id} className="overflow-hidden hover:shadow-print transition-shadow">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabels[project.category]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">
                {selectedCategory === 'all'
                  ? 'No projects have been added to the gallery yet.'
                  : `No projects in the ${categoryLabels[selectedCategory]} category yet.`}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
