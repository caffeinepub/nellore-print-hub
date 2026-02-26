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

export default function AboutContentManagementPage() {
  const navigate = useNavigate();
  const { data: adminContent, isLoading } = useGetAdminContent();
  const updateContent = useUpdateAdminContent();

  const [aboutPageContent, setAboutPageContent] = useState('');

  useEffect(() => {
    if (adminContent) {
      setAboutPageContent(adminContent.aboutPageContent || '');
    }
  }, [adminContent]);

  const handleSave = async () => {
    if (!adminContent) return;
    try {
      await updateContent.mutateAsync({
        ...adminContent,
        aboutPageContent,
      });
      toast.success('About page content saved! / అబౌట్ పేజ్ కంటెంట్ సేవ్ చేయబడింది!');
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
              <h1 className="font-bold text-foreground">About Page Content</h1>
              <p className="text-xs text-muted-foreground">అబౌట్ పేజ్ కంటెంట్</p>
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
                  About Page Content
                  <span className="block text-sm font-normal text-muted-foreground">అబౌట్ పేజ్ కంటెంట్</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>
                    About Page Text
                    <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                      This text will appear as a special announcement or custom section on the About page.
                      అబౌట్ పేజ్‌లో ప్రత్యేక విభాగంగా కనిపిస్తుంది.
                    </span>
                  </Label>
                  <Textarea
                    className="mt-2 min-h-[200px]"
                    placeholder="Enter about page content, company story, special announcements..."
                    value={aboutPageContent}
                    onChange={(e) => setAboutPageContent(e.target.value)}
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
