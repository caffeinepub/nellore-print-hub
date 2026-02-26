import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllProjects } from '../hooks/useProjects';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import ProjectDetailModal from '../components/ProjectDetailModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Filter } from 'lucide-react';
import { Project } from '../backend';

const CATEGORIES = [
  { value: 'all', en: 'All', te: 'అన్నీ' },
  { value: 'digital', en: 'Digital', te: 'డిజిటల్' },
  { value: 'banner', en: 'Banner', te: 'బ్యానర్' },
  { value: 'offset', en: 'Offset', te: 'ఆఫ్‌సెట్' },
  { value: 'design', en: 'Design', te: 'డిజైన్' },
];

export default function ProjectGalleryPage() {
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: projects, isLoading } = useGetAllProjects();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projects?.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category.toString().toLowerCase() === selectedCategory;
  }) ?? [];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 to-background py-10 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-foreground mb-1">Project Gallery</h1>
        <p className="text-xl text-primary font-semibold mb-2">ప్రాజెక్ట్ గ్యాలరీ</p>
        <p className="text-muted-foreground text-sm">
          Our completed work / మా పూర్తయిన పని
        </p>
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat.en} / {cat.te}
            </button>
          ))}
          {isAdmin && (
            <Button
              size="sm"
              className="shrink-0 ml-auto h-7 text-xs"
              onClick={() => navigate({ to: '/admin/projects' })}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Manage
            </Button>
          )}
        </div>
      </div>

      {/* Masonry Gallery */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-3">
                <Skeleton
                  className="w-full rounded-xl"
                  style={{ height: `${[200, 280, 180, 240, 300, 160, 220, 260][i % 8]}px` }}
                />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No projects found</p>
            <p className="text-muted-foreground text-sm">ప్రాజెక్టులు కనుగొనబడలేదు</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="break-inside-avoid mb-3 group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <Badge variant="secondary" className="text-xs mb-1">
                        {project.category.toString()}
                      </Badge>
                      <p className="text-white text-sm font-semibold line-clamp-1">{project.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </div>
  );
}
