import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Project, ServiceType } from '../backend';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectDetailModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

const categoryLabels: Record<ServiceType, { en: string; te: string }> = {
  [ServiceType.digital]: { en: 'Digital', te: 'డిజిటల్' },
  [ServiceType.banner]: { en: 'Banner', te: 'బ్యానర్' },
  [ServiceType.offset]: { en: 'Offset', te: 'ఆఫ్‌సెట్' },
  [ServiceType.design]: { en: 'Design', te: 'డిజైన్' },
};

export default function ProjectDetailModal({ open, onClose, project }: ProjectDetailModalProps) {
  const { language } = useLanguage();

  if (!project) return null;

  const categoryLabel = categoryLabels[project.category]?.[language] ?? project.category;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden rounded-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
          aria-label={language === 'te' ? 'మూసివేయి' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Project Image */}
        <div className="w-full aspect-video bg-muted overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/generated/hero-bg.dim_1920x1080.png';
            }}
          />
        </div>

        {/* Project Details */}
        <div className="p-5 space-y-3">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="text-lg font-bold text-foreground leading-tight">
                {project.title}
              </DialogTitle>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {categoryLabel}
              </Badge>
            </div>
          </DialogHeader>

          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </DialogDescription>

          <div className="pt-1 text-xs text-muted-foreground">
            {language === 'te' ? 'పూర్తయిన తేదీ:' : 'Completed:'}{' '}
            {new Date(Number(project.dateCompleted) / 1_000_000).toLocaleDateString(
              language === 'te' ? 'te-IN' : 'en-IN',
              { year: 'numeric', month: 'long', day: 'numeric' }
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
