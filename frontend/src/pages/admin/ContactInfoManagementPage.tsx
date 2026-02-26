import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import AdminGuard from '../../components/AdminGuard';
import { useGetAdminContent, useUpdateAdminContent } from '../../hooks/useAdminContent';
import { useGetContactInfo } from '../../hooks/useContactInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Save, Phone, Mail, MapPin, Link } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactInfoManagementPage() {
  const navigate = useNavigate();
  const { data: adminContent, isLoading: adminLoading } = useGetAdminContent();
  const { data: contactInfo, isLoading: contactLoading } = useGetContactInfo();
  const updateContent = useUpdateAdminContent();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [mapsLink, setMapsLink] = useState('');

  const isLoading = adminLoading || contactLoading;

  useEffect(() => {
    // Prefer adminContent.contactInfo, fallback to contactInfo
    const info = adminContent?.contactInfo || contactInfo;
    if (info) {
      setEmail(info.email || '');
      setPhone(info.phone || '');
      setPhysicalAddress(info.physicalAddress || '');
      setMapsLink(info.mapsLink || '');
    }
  }, [adminContent, contactInfo]);

  const handleSave = async () => {
    const newContactInfo = { email, phone, physicalAddress, mapsLink };
    try {
      if (adminContent) {
        await updateContent.mutateAsync({
          ...adminContent,
          contactInfo: newContactInfo,
        });
      } else {
        // Fallback: create minimal admin content
        await updateContent.mutateAsync({
          contactInfo: newContactInfo,
          services: [],
          businessHours: [],
          gallery: [],
          homepageContent: '',
          aboutPageContent: '',
        });
      }
      toast.success('Contact info saved! / సంప్రదింపు సమాచారం సేవ్ చేయబడింది!');
    } catch {
      toast.error('Failed to save contact info');
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/admin/dashboard' })}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-foreground">Contact Information</h1>
              <p className="text-xs text-muted-foreground">సంప్రదింపు సమాచారం</p>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Edit Contact Details
                  <span className="block text-sm font-normal text-muted-foreground">సంప్రదింపు వివరాలు సవరించండి</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" /> Email / ఇమెయిల్
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" /> Phone / ఫోన్
                  </Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> Physical Address / భౌతిక చిరునామా
                  </Label>
                  <Input
                    value={physicalAddress}
                    onChange={(e) => setPhysicalAddress(e.target.value)}
                    placeholder="Street, City, State"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <Link className="w-4 h-4" /> Google Maps Link / గూగుల్ మ్యాప్స్ లింక్
                  </Label>
                  <Input
                    type="url"
                    value={mapsLink}
                    onChange={(e) => setMapsLink(e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSave}
                  disabled={updateContent.isPending}
                >
                  {updateContent.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save Changes / మార్పులు సేవ్ చేయండి</>
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
