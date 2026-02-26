import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Type, Save, CheckCircle, AlertCircle } from 'lucide-react';
import AdminGuard from '../../components/AdminGuard';
import { useGetAppName, useSetAppName } from '../../hooks/useAppName';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function AppNameManagementContent() {
  const navigate = useNavigate();
  const { data: currentName, isLoading } = useGetAppName();
  const setAppName = useSetAppName();

  const [name, setName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentName) setName(currentName);
  }, [currentName]);

  const handleSave = async () => {
    setSuccessMsg('');
    setErrorMsg('');
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg('App name cannot be empty.');
      return;
    }
    if (trimmed.length > 100) {
      setErrorMsg('App name must be 100 characters or fewer.');
      return;
    }
    try {
      await setAppName.mutateAsync(trimmed);
      setSuccessMsg('App name updated successfully!');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update app name.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[oklch(0.18_0.04_240)] text-white border-b border-[oklch(0.25_0.04_240)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/admin/dashboard' })}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-[oklch(0.55_0.18_25)]" />
            <h1 className="text-lg font-semibold">App Name Management</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-card shadow-print p-6">
          <div className="mb-6">
            <h2 className="text-title font-serif text-foreground mb-1">Application Name</h2>
            <p className="text-sm text-muted-foreground">
              This name appears in the header, footer, and browser tab across the entire application.
              Only administrators can change this setting.
            </p>
          </div>

          {isLoading ? (
            <div className="h-10 bg-muted rounded animate-pulse mb-4" />
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="appName" className="text-sm font-medium text-foreground mb-1.5 block">
                  Application Name
                </Label>
                <Input
                  id="appName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter application name..."
                  maxLength={100}
                  className="border-border focus:ring-[oklch(0.48_0.18_25)] focus:border-[oklch(0.48_0.18_25)]"
                />
                <p className="text-xs text-muted-foreground mt-1">{name.length}/100 characters</p>
              </div>

              {successMsg && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <Button
                onClick={handleSave}
                disabled={setAppName.isPending || !name.trim()}
                className="w-full bg-[oklch(0.18_0.04_240)] hover:bg-[oklch(0.25_0.04_240)] text-white"
              >
                {setAppName.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save App Name
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 bg-[oklch(0.92_0.06_25)]/30 border border-[oklch(0.48_0.18_25)]/20 rounded-card p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> The default application name is "Nellore Printing Hub".
            Changes take effect immediately across all pages without requiring a page refresh.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AppNameManagementPage() {
  return (
    <AdminGuard>
      <AppNameManagementContent />
    </AdminGuard>
  );
}
