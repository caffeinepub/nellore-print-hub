import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGetAllProjects } from '../hooks/useProjects';
import { ServiceType } from '../backend';
import ProjectDetailModal from '../components/ProjectDetailModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Image } from 'lucide-react';

export default function ProjectGalleryPage() {
  const { t } = useLanguage();
  const { data: projects, isLoading } = useGetAllProjects();
  const [selectedCategory, setSelectedCategory] = useState<ServiceType | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const categories = [
    { value: 'all', label: t('allCategories') },
    { value: ServiceType.digital, label: t('digitalPrinting') },
    { value: ServiceType.banner, label: t('bannerPrinting') },
    { value: ServiceType.offset, label: t('offsetPrinting') },
    { value: ServiceType.design, label: t('designServices') },
  ];

  const filtered = projects?.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  ) ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            {t('galleryTitle')}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            {t('galleryTitle')}
          </h1>
          <p className="text-lg text-muted-foreground">{t('gallerySubtitle')}</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 border-b border-border bg-background sticky top-16 z-10">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.value as ServiceType | 'all')}
              className={`shrink-0 rounded-full transition-all ${
                selectedCategory === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:border-primary hover:text-primary'
              }`}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-48 rounded-xl break-inside-avoid mb-4" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {t('language') === 'te' ? 'ఇంకా ప్రాజెక్టులు లేవు' : 'No projects yet'}
              </p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {filtered.map((project) => (
                <div
                  key={project.id}
                  className="break-inside-avoid mb-4 group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <div>
                        <p className="text-white font-semibold text-sm">{project.title}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
