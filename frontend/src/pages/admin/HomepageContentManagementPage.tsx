import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import AdminGuard from '../../components/AdminGuard';
import { useGetAdminContent, useUpdateAdminContent } from '../../hooks/useAdminContent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function HomepageContentManagementPage() {
  const navigate = useNavigate();
  const { data: adminContent, isLoading } = useGetAdminContent();
  const updateContent = useUpdateAdminContent();

  const [homepageContent, setHomepageContent] = useState('');

  useEffect(() => {
    if (adminContent) {
      setHomepageContent(adminContent.homepageContent || '');
    }
  }, [adminContent]);

  const handleSave = async () => {
    if (!adminContent) return;
    try {
      await updateContent.mutateAsync({
        ...adminContent,
        homepageContent,
      });
      toast.success('Homepage content saved! / హోమ్‌పేజ్ కంటెంట్ సేవ్ చేయబడింది!');
    } catch {
      toast.error('Failed to save content');
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/admin/dashboard' })}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-foreground">Homepage Content</h1>
              <p className="text-xs text-muted-foreground">హోమ్‌పేజ్ కంటెంట్</p>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Promotional / Hero Content
                  <span className="block text-sm font-normal text-muted-foreground">ప్రమోషనల్ కంటెంట్</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>
                    Homepage Announcement / Promo Text
                    <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                      This text will appear as a promotional banner on the homepage.
                      హోమ్‌పేజ్‌లో ప్రమోషనల్ బ్యానర్‌గా కనిపిస్తుంది.
                    </span>
                  </Label>
                  <Textarea
                    className="mt-2 min-h-[200px]"
                    placeholder="Enter promotional content, special offers, announcements..."
                    value={homepageContent}
                    onChange={(e) => setHomepageContent(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={updateContent.isPending}
                  className="w-full"
                >
                  {updateContent.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save Content / సేవ్ చేయండి</>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
