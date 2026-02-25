import { useState, useRef } from 'react';
import { useGetAllProjects, useAddProject } from '../hooks/useProjects';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Loader2, ImagePlus, Images } from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import SkeletonCard from '../components/SkeletonCard';
import SwipeContainer from '../components/SwipeContainer';
import PullToRefreshContainer from '../components/PullToRefreshContainer';
import ProjectDetailModal from '../components/ProjectDetailModal';
import { ServiceType, Project } from '../backend';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProjectGalleryPage() {
  const { language } = useLanguage();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: projects, isLoading, refetch } = useGetAllProjects();
  const addProject = useAddProject();

  const [selectedCategory, setSelectedCategory] = useState<ServiceType | 'all'>('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Detail modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceType>(ServiceType.digital);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'all' as const, label: language === 'te' ? 'అన్నీ' : 'All' },
    { value: ServiceType.digital, label: language === 'te' ? 'డిజిటల్' : 'Digital' },
    { value: ServiceType.banner, label: language === 'te' ? 'బ్యానర్' : 'Banner' },
    { value: ServiceType.offset, label: language === 'te' ? 'ఆఫ్‌సెట్' : 'Offset' },
    { value: ServiceType.design, label: language === 'te' ? 'డిజైన్' : 'Design' },
  ];

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects?.filter((p) => p.category === selectedCategory);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(language === 'te' ? 'దయచేసి ఇమేజ్ ఫైల్ ఎంచుకోండి' : 'Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(language === 'te' ? 'ఇమేజ్ 10MB కంటే తక్కువగా ఉండాలి' : 'Image must be smaller than 10MB');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(ServiceType.digital);
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadSubmit = async () => {
    if (!imageFile) {
      toast.error(language === 'te' ? 'దయచేసి ఇమేజ్ ఎంచుకోండి' : 'Please select an image');
      return;
    }
    if (!title.trim()) {
      toast.error(language === 'te' ? 'దయచేసి శీర్షిక నమోదు చేయండి' : 'Please enter a title');
      return;
    }
    if (!description.trim()) {
      toast.error(language === 'te' ? 'దయచేసి వివరణ నమోదు చేయండి' : 'Please enter a description');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      const imageUrl = blob.getDirectURL();

      await addProject.mutateAsync({
        imageUrl,
        title: title.trim(),
        description: description.trim(),
        category,
      });

      toast.success(language === 'te' ? 'ప్రాజెక్ట్ విజయవంతంగా అప్‌లోడ్ చేయబడింది!' : 'Project uploaded successfully!');
      setUploadOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || (language === 'te' ? 'ప్రాజెక్ట్ అప్‌లోడ్ విఫలమైంది' : 'Failed to upload project'));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <SwipeContainer>
        <PullToRefreshContainer onRefresh={handleRefresh}>
          <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-16 px-4">
              <div className="container text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                  {language === 'te' ? 'ప్రాజెక్ట్ ' : 'Project '}
                  <span className="text-primary">
                    {language === 'te' ? 'గ్యాలరీ' : 'Gallery'}
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  {language === 'te'
                    ? 'మా పూర్తయిన ప్రాజెక్టుల పోర్ట్‌ఫోలియోను అన్వేషించండి'
                    : 'Explore our portfolio of completed projects'}
                </p>
              </div>
            </section>

            <section className="py-8 md:py-12 px-4 flex-1">
              <div className="container max-w-4xl mx-auto">
                {/* Admin Upload Button */}
                {isAdmin && (
                  <div className="flex justify-end mb-6">
                    <Button
                      onClick={() => setUploadOpen(true)}
                      className="gap-2 min-h-[44px]"
                    >
                      <ImagePlus className="w-4 h-4" />
                      {language === 'te' ? 'ఫోటో అప్‌లోడ్ చేయండి' : 'Upload Photo'}
                    </Button>
                  </div>
                )}

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                  {categories.map((cat) => (
                    <Button
                      key={cat.value}
                      variant={selectedCategory === cat.value ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(cat.value)}
                      className="shrink-0 min-h-[36px] text-sm rounded-full px-4"
                      size="sm"
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>

                {/* Projects Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <SkeletonCard key={i} variant="project" />
                    ))}
                  </div>
                ) : !filteredProjects || filteredProjects.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                      <Images className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">
                      {language === 'te' ? 'ఇంకా ప్రాజెక్టులు లేవు' : 'No projects yet'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'te'
                        ? 'త్వరలో మా పోర్ట్‌ఫోలియో ఇక్కడ కనిపిస్తుంది'
                        : 'Our portfolio will appear here soon'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="group text-left rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                        aria-label={project.title}
                      >
                        <div className="aspect-square overflow-hidden bg-muted">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/generated/hero-bg.dim_1920x1080.png';
                            }}
                          />
                        </div>
                        <div className="p-3 space-y-1.5">
                          <p className="font-semibold text-sm text-foreground line-clamp-1">
                            {project.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {categories.find(c => c.value === project.category)?.label ?? project.category}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </PullToRefreshContainer>
      </SwipeContainer>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />

      {/* Admin Upload Dialog */}
      {isAdmin && (
        <Dialog open={uploadOpen} onOpenChange={(open) => { if (!open) { setUploadOpen(false); resetForm(); } }}>
          <DialogContent className="max-w-md w-full rounded-2xl">
            <DialogHeader>
              <DialogTitle>
                {language === 'te' ? 'కొత్త ప్రాజెక్ట్ అప్‌లోడ్ చేయండి' : 'Upload New Project'}
              </DialogTitle>
              <DialogDescription>
                {language === 'te'
                  ? 'గ్యాలరీకి కొత్త ప్రాజెక్ట్ ఫోటో జోడించండి'
                  : 'Add a new project photo to the gallery'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Image Upload */}
              <div>
                <Label className="text-sm font-medium mb-1.5 block">
                  {language === 'te' ? 'ప్రాజెక్ట్ ఇమేజ్' : 'Project Image'}
                </Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="py-6 space-y-2">
                      <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        {language === 'te' ? 'ఇమేజ్ ఎంచుకోవడానికి క్లిక్ చేయండి' : 'Click to select image'}
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="proj-title" className="text-sm font-medium mb-1.5 block">
                  {language === 'te' ? 'శీర్షిక' : 'Title'}
                </Label>
                <Input
                  id="proj-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={language === 'te' ? 'ప్రాజెక్ట్ శీర్షిక' : 'Project title'}
                  className="rounded-xl"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="proj-desc" className="text-sm font-medium mb-1.5 block">
                  {language === 'te' ? 'వివరణ' : 'Description'}
                </Label>
                <Textarea
                  id="proj-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={language === 'te' ? 'ప్రాజెక్ట్ వివరణ' : 'Project description'}
                  rows={3}
                  className="rounded-xl resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <Label className="text-sm font-medium mb-1.5 block">
                  {language === 'te' ? 'వర్గం' : 'Category'}
                </Label>
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val as ServiceType)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ServiceType.digital}>Digital</SelectItem>
                    <SelectItem value={ServiceType.banner}>Banner</SelectItem>
                    <SelectItem value={ServiceType.offset}>Offset</SelectItem>
                    <SelectItem value={ServiceType.design}>Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Upload Progress */}
              {isUploading && uploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'te' ? 'అప్‌లోడ్ అవుతోంది...' : 'Uploading...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => { setUploadOpen(false); resetForm(); }}
                disabled={isUploading}
                className="rounded-xl"
              >
                {language === 'te' ? 'రద్దు చేయండి' : 'Cancel'}
              </Button>
              <Button
                onClick={handleUploadSubmit}
                disabled={isUploading || !imageFile || !title.trim() || !description.trim()}
                className="rounded-xl gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {language === 'te' ? 'అప్‌లోడ్ అవుతోంది...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-4 h-4" />
                    {language === 'te' ? 'అప్‌లోడ్ చేయండి' : 'Upload'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
