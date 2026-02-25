import { useState } from 'react';
import AdminGuard from '../../components/AdminGuard';
import { useGetCompanyLogo, useSetCompanyLogo } from '../../hooks/useCompanyLogo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Image, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';

export default function LogoManagementPage() {
  return (
    <AdminGuard>
      <LogoManagementContent />
    </AdminGuard>
  );
}

function LogoManagementContent() {
  const { data: currentLogo, isLoading } = useGetCompanyLogo();
  const setLogo = useSetCompanyLogo();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await setLogo.mutateAsync(blob);
      toast.success('Logo updated successfully!');
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
    } catch (error) {
      toast.error('Failed to upload logo');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 md:py-20">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Logo <span className="text-primary">Management</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Upload and manage your company logo
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-3xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Current Logo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-40 w-40 rounded-lg" />
              ) : currentLogo ? (
                <div className="space-y-4">
                  <img
                    src={currentLogo.getDirectURL()}
                    alt="Company Logo"
                    className="h-40 w-40 object-cover rounded-lg border"
                  />
                  <p className="text-sm text-muted-foreground">
                    This logo is displayed in the header and footer of your website.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No logo uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload New Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo-upload">Select Image</Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, max 5MB (PNG, JPG, or SVG)
                </p>
              </div>

              {previewUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-40 w-40 object-cover rounded-lg border"
                  />
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <Label>Upload Progress</Label>
                  <Progress value={uploadProgress} />
                  <p className="text-xs text-muted-foreground text-center">
                    {uploadProgress}%
                  </p>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || setLogo.isPending}
                className="w-full"
              >
                {setLogo.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
