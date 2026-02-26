import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import AdminGuard from '../../components/AdminGuard';
import { useGetAdminContent, useUpdateAdminContent } from '../../hooks/useAdminContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const DAYS = [
  { en: 'Monday', te: 'సోమవారం', key: 'Mon' },
  { en: 'Tuesday', te: 'మంగళవారం', key: 'Tue' },
  { en: 'Wednesday', te: 'బుధవారం', key: 'Wed' },
  { en: 'Thursday', te: 'గురువారం', key: 'Thu' },
  { en: 'Friday', te: 'శుక్రవారం', key: 'Fri' },
  { en: 'Saturday', te: 'శనివారం', key: 'Sat' },
  { en: 'Sunday', te: 'ఆదివారం', key: 'Sun' },
];

const DEFAULT_HOURS = DAYS.map((d) => `${d.key}: 09:00 - 18:00`);

export default function BusinessHoursManagementPage() {
  const navigate = useNavigate();
  const { data: adminContent, isLoading } = useGetAdminContent();
  const updateContent = useUpdateAdminContent();

  const [hours, setHours] = useState<string[]>(DEFAULT_HOURS);

  useEffect(() => {
    if (adminContent?.businessHours && adminContent.businessHours.length > 0) {
      setHours(adminContent.businessHours);
    }
  }, [adminContent]);

  const parseHour = (entry: string) => {
    // Format: "Mon: 09:00 - 18:00" or "Mon: Closed"
    const colonIdx = entry.indexOf(':');
    const times = colonIdx !== -1 ? entry.substring(colonIdx + 1).trim() : '';
    if (times === 'Closed') return { open: '', close: '', closed: true };
    const [open, close] = times.split(' - ');
    return { open: open || '09:00', close: close || '18:00', closed: false };
  };

  const updateHour = (index: number, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    const newHours = [...hours];
    const day = DAYS[index];
    const current = parseHour(newHours[index]);
    if (field === 'closed') {
      newHours[index] = value ? `${day.key}: Closed` : `${day.key}: 09:00 - 18:00`;
    } else if (field === 'open') {
      newHours[index] = `${day.key}: ${value} - ${current.close}`;
    } else {
      newHours[index] = `${day.key}: ${current.open} - ${value}`;
    }
    setHours(newHours);
  };

  const handleSave = async () => {
    if (!adminContent) return;
    try {
      await updateContent.mutateAsync({
        ...adminContent,
        businessHours: hours,
      });
      toast.success('Business hours saved! / వ్యాపార సమయాలు సేవ్ చేయబడ్డాయి!');
    } catch {
      toast.error('Failed to save business hours');
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
              <h1 className="font-bold text-foreground">Business Hours</h1>
              <p className="text-xs text-muted-foreground">వ్యాపార సమయాలు</p>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {DAYS.map((day, index) => {
                const parsed = parseHour(hours[index] || DEFAULT_HOURS[index]);
                return (
                  <Card key={day.key}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-28 shrink-0">
                          <p className="font-medium text-sm">{day.en}</p>
                          <p className="text-xs text-muted-foreground">{day.te}</p>
                        </div>
                        {parsed.closed ? (
                          <div className="flex-1 flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">Closed / మూసివేయబడింది</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateHour(index, 'closed', false)}
                            >
                              Set Hours
                            </Button>
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              type="time"
                              value={parsed.open}
                              onChange={(e) => updateHour(index, 'open', e.target.value)}
                              className="w-32"
                            />
                            <span className="text-muted-foreground text-sm">to</span>
                            <Input
                              type="time"
                              value={parsed.close}
                              onChange={(e) => updateHour(index, 'close', e.target.value)}
                              className="w-32"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateHour(index, 'closed', true)}
                              className="text-muted-foreground"
                            >
                              Close
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <Button
                className="w-full mt-4"
                onClick={handleSave}
                disabled={updateContent.isPending}
              >
                {updateContent.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Business Hours / సేవ్ చేయండి</>
                )}
              </Button>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
