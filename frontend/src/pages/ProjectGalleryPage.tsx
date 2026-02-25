import { useState, useRef } from 'react';
import { useGetAllProjects, useAddProject } from '../hooks/useProjects';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Loader2, LogIn, Upload, ImagePlus } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import SkeletonCard from '../components/SkeletonCard';
import SwipeContainer from '../components/SwipeContainer';
import PullToRefreshContainer from '../components/PullToRefreshContainer';
import { ServiceType } from '../backend';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export default function ProjectGalleryPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: projects, isLoading, refetch } = useGetAllProjects();
  const addProject = useAddProject();

  const [selectedCategory, setSelectedCategory] = useState<ServiceType | 'all'>('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceType>(ServiceType.digital);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAuthenticated = !!identity;

  const categories = [
    { value: 'all' as const, label: 'All Projects' },
    { value: ServiceType.digital, label: 'Digital' },
    { value: ServiceType.banner, label: 'Banner' },
    { value: ServiceType.offset, label: 'Offset' },
    { value: ServiceType.design, label: 'Design' },
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
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be smaller than 10MB');
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
      toast.error('Please select an image');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
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

      toast.success('Project uploaded successfully!');
      setUploadOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload project');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col">
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Project <span className="text-primary">Gallery</span>
            </h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-2xl">
            <Alert>
              <LogIn className="h-5 w-5" />
              <AlertTitle>Sign in Required</AlertTitle>
              <AlertDescription className="mt-2">
                Please sign in to view the project gallery.
              </AlertDescription>
              <div className="mt-4">
                <Button onClick={login} disabled={loginStatus === 'logging-in'}>
                  {loginStatus === 'logging-in' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </Alert>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <SwipeContainer>
        <PullToRefreshContainer onRefresh={handleRefresh}>
          <div className="flex flex-col min-h-screen">
            <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 md:py-16 px-4">
              <div className="container text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                  Project <span className="text-primary">Gallery</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Explore our portfolio of completed projects
                </p>
              </div>
            </section>

            <section className="py-8 md:py-12 px-4 flex-1">
              <div className="container">
                {/* Admin Upload Button */}
                {isAdmin && (
                  <div className="flex justify-end mb-6">
                    <Button
                      onClick={() => setUploadOpen(true)}
                      className="gap-2 min-h-[44px]"
                    >
                      <ImagePlus className="w-4 h-4" />
                      Upload Photo
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
                      className="min-h-[44px] whitespace-nowrap"
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {[...Array(6)].map((_, idx) => (
                      <SkeletonCard key={idx} variant="project" />
                    ))}
                  </div>
                ) : filteredProjects && filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredProjects.map((project) => (
                      <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video relative overflow-hidden bg-muted">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-lg line-clamp-1">{project.title}</h3>
                            <Badge variant="secondary" className="capitalize flex-shrink-0">
                              {project.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Completed:{' '}
                            {new Date(Number(project.dateCompleted) / 1000000).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">
                      No projects found in this category
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </PullToRefreshContainer>
      </SwipeContainer>

      {/* Upload Photo Dialog */}
      <Dialog
        open={uploadOpen}
        onOpenChange={(open) => {
          if (!isUploading) {
            setUploadOpen(open);
            if (!open) resetForm();
          }
        }}
      >
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Upload Project Photo</DialogTitle>
            <DialogDescription>
              Add a new project to the gallery. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Project Image *</Label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">Click to select an image</span>
                    <span className="text-xs">JPG, PNG, WebP up to 10MB</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="proj-title">Title *</Label>
              <Input
                id="proj-title"
                placeholder="e.g. Wedding Banner Design"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
                className="min-h-[44px]"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="proj-desc">Description *</Label>
              <Textarea
                id="proj-desc"
                placeholder="Brief description of the project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
                rows={3}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as ServiceType)}
                disabled={isUploading}
              >
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ServiceType.digital}>Digital Printing</SelectItem>
                  <SelectItem value={ServiceType.banner}>Flex & Banner</SelectItem>
                  <SelectItem value={ServiceType.offset}>Offset Printing</SelectItem>
                  <SelectItem value={ServiceType.design}>Creative Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setUploadOpen(false);
                resetForm();
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit} disabled={isUploading || !imageFile}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
