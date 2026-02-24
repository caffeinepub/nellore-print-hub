import { useState } from 'react';
import { useGetAllProjects, useAddProject, useEditProject, useDeleteProject } from '../../hooks/useProjects';
import AdminGuard from '../../components/AdminGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { ServiceType, Project } from '../../backend';
import { ExternalBlob } from '../../lib/blobStorage';

export default function ProjectManagementPage() {
  return (
    <AdminGuard>
      <ProjectManagementContent />
    </AdminGuard>
  );
}

function ProjectManagementContent() {
  const { data: projects, isLoading } = useGetAllProjects();
  const addProject = useAddProject();
  const editProject = useEditProject();
  const deleteProject = useDeleteProject();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceType | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
    setEditMode(false);
    setSelectedProject(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setCategory(project.category);
    setImagePreview(ExternalBlob.fromURL(project.imageUrl).getDirectURL());
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!editMode && !imageFile) {
      toast.error('Please upload an image');
      return;
    }

    try {
      let imageUrl = selectedProject?.imageUrl || '';

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
        imageUrl = blob.getDirectURL();
      }

      if (editMode && selectedProject) {
        await editProject.mutateAsync({
          projectId: selectedProject.id,
          imageUrl,
          title,
          description,
          category: category as ServiceType,
        });
        toast.success('Project updated successfully');
      } else {
        await addProject.mutateAsync({
          imageUrl,
          title,
          description,
          category: category as ServiceType,
        });
        toast.success('Project added successfully');
      }

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${editMode ? 'update' : 'add'} project`);
      console.error(error);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject.mutateAsync(projectId);
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container flex justify-between items-center">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Project <span className="text-primary">Management</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Manage your portfolio and showcase your work
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="lg" onClick={openAddDialog}>
                <Plus className="mr-2 h-5 w-5" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editMode ? 'Edit Project' : 'Add New Project'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as ServiceType)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">Digital Printing</SelectItem>
                      <SelectItem value="banner">Flex & Banner Printing</SelectItem>
                      <SelectItem value="offset">Offset Printing</SelectItem>
                      <SelectItem value="design">Creative Design Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the project..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Project Image *</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="absolute bottom-2 left-2 right-2 bg-background/90 rounded-full h-2">
                          <div
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <Label htmlFor="image" className="cursor-pointer text-primary hover:underline">
                        Click to upload image
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={addProject.isPending || editProject.isPending}
                >
                  {(addProject.isPending || editProject.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editMode ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editMode ? 'Update Project' : 'Add Project'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="pt-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={ExternalBlob.fromURL(project.imageUrl).getDirectURL()}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(project)}
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(project.id)}
                        disabled={deleteProject.isPending}
                      >
                        {deleteProject.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start building your portfolio by adding your first project.
                </p>
                <Button onClick={openAddDialog}>
                  <Plus className="mr-2 h-5 w-5" />
                  Add First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
