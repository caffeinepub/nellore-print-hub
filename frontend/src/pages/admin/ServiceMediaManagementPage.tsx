import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import AdminGuard from '../../components/AdminGuard';
import { useGetServiceImages, useAddServiceImage, useDeleteServiceImage } from '../../hooks/useServiceImages';
import { useGetVideoClips, useAddVideoClip, useDeleteVideoClip } from '../../hooks/useVideoClips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2, Plus, ArrowLeft, Image, Video } from 'lucide-react';
import { toast } from 'sonner';

const SERVICE_TYPES = [
  { value: 'digital', label: 'Digital Printing / డిజిటల్ ప్రింటింగ్' },
  { value: 'banner', label: 'Banner / Flex / బ్యానర్' },
  { value: 'offset', label: 'Offset Printing / ఆఫ్‌సెట్' },
  { value: 'design', label: 'Design Services / డిజైన్' },
];

function ServiceImagesTab() {
  const { data: images, isLoading } = useGetServiceImages();
  const addImage = useAddServiceImage();
  const deleteImage = useDeleteServiceImage();

  const [serviceType, setServiceType] = useState('digital');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    if (!imageUrl.trim()) return;
    try {
      await addImage.mutateAsync({ serviceType, imageUrl, description });
      setImageUrl('');
      setDescription('');
      toast.success('Image added successfully');
    } catch {
      toast.error('Failed to add image');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteImage.mutateAsync(id);
      toast.success('Image deleted');
    } catch {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Add Service Image
            <span className="block text-sm font-normal text-muted-foreground">సేవా చిత్రం జోడించండి</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Service Type / సేవా రకం</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Image URL / చిత్రం URL</Label>
            <Input
              className="mt-1"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div>
            <Label>Description / వివరణ</Label>
            <Input
              className="mt-1"
              placeholder="Brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button onClick={handleAdd} disabled={addImage.isPending || !imageUrl.trim()}>
            {addImage.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Image / చిత్రం జోడించండి
          </Button>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold mb-3">
          Existing Images / ఇప్పటికే ఉన్న చిత్రాలు ({images?.length ?? 0})
        </h3>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : images?.length === 0 ? (
          <p className="text-muted-foreground text-sm">No images added yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images?.map((img) => (
              <Card key={img.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img
                    src={img.imageUrl}
                    alt={img.description}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/assets/generated/print-sample-banner.dim_800x450.png'; }}
                  />
                </div>
                <CardContent className="p-2">
                  <p className="text-xs font-medium truncate">{img.serviceType}</p>
                  <p className="text-xs text-muted-foreground truncate">{img.description}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full mt-2 h-7 text-xs"
                    onClick={() => handleDelete(img.id)}
                    disabled={deleteImage.isPending}
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VideoClipsTab() {
  const { data: clips, isLoading } = useGetVideoClips();
  const addClip = useAddVideoClip();
  const deleteClip = useDeleteVideoClip();

  const [serviceType, setServiceType] = useState('digital');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    if (!videoUrl.trim()) return;
    try {
      await addClip.mutateAsync({ serviceType, videoUrl, thumbnailUrl, description });
      setVideoUrl('');
      setThumbnailUrl('');
      setDescription('');
      toast.success('Video clip added successfully');
    } catch {
      toast.error('Failed to add video clip');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClip.mutateAsync(id);
      toast.success('Video clip deleted');
    } catch {
      toast.error('Failed to delete video clip');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Add Video Clip
            <span className="block text-sm font-normal text-muted-foreground">వీడియో క్లిప్ జోడించండి</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Service Type / సేవా రకం</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Video URL (YouTube embed or direct) / వీడియో URL</Label>
            <Input
              className="mt-1"
              placeholder="https://youtube.com/embed/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
          <div>
            <Label>Thumbnail URL (optional) / థంబ్‌నెయిల్ URL</Label>
            <Input
              className="mt-1"
              placeholder="https://..."
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
          </div>
          <div>
            <Label>Description / వివరణ</Label>
            <Input
              className="mt-1"
              placeholder="Brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button onClick={handleAdd} disabled={addClip.isPending || !videoUrl.trim()}>
            {addClip.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Video / వీడియో జోడించండి
          </Button>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold mb-3">
          Existing Videos / ఇప్పటికే ఉన్న వీడియోలు ({clips?.length ?? 0})
        </h3>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : clips?.length === 0 ? (
          <p className="text-muted-foreground text-sm">No video clips added yet.</p>
        ) : (
          <div className="space-y-3">
            {clips?.map((clip) => (
              <Card key={clip.id}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-16 h-12 bg-muted rounded overflow-hidden shrink-0">
                    {clip.thumbnailUrl ? (
                      <img src={clip.thumbnailUrl} alt={clip.description} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{clip.serviceType}</p>
                    <p className="text-xs text-muted-foreground truncate">{clip.description}</p>
                    <p className="text-xs text-primary truncate">{clip.videoUrl}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => handleDelete(clip.id)}
                    disabled={deleteClip.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServiceMediaManagementPage() {
  const navigate = useNavigate();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/admin/dashboard' })}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-foreground">Service Media</h1>
              <p className="text-xs text-muted-foreground">సేవా మీడియా నిర్వహణ</p>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          <Tabs defaultValue="images">
            <TabsList className="mb-6">
              <TabsTrigger value="images">
                <Image className="w-4 h-4 mr-2" />
                Images / చిత్రాలు
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="w-4 h-4 mr-2" />
                Videos / వీడియోలు
              </TabsTrigger>
            </TabsList>
            <TabsContent value="images">
              <ServiceImagesTab />
            </TabsContent>
            <TabsContent value="videos">
              <VideoClipsTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminGuard>
  );
}
