import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserPlus, CheckCircle2, XCircle, ArrowRight, Fingerprint, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAdminInvitations, useInviteAdminUser } from '@/hooks/useAdminInvitations';
import AdminGuard from '@/components/AdminGuard';

function AdminUserManagementContent() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { data: admins, isLoading } = useGetAdminInvitations();
  const inviteMutation = useInviteAdminUser();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      await inviteMutation.mutateAsync({ email, password });
      toast.success('Admin user invited successfully!');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to invite admin user');
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage admin users and invite new partners
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleInvite}>
              <DialogHeader>
                <DialogTitle>Invite New Admin</DialogTitle>
                <DialogDescription>
                  Create a new admin account for a partner. They will be able to log in with the
                  provided credentials.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="partner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={inviteMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-password">Password</Label>
                  <Input
                    id="invite-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={inviteMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-confirm-password">Confirm Password</Label>
                  <Input
                    id="invite-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={inviteMutation.isPending}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={inviteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={inviteMutation.isPending}>
                  {inviteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inviting...
                    </>
                  ) : (
                    'Invite Admin'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Navigate to admin registration page</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/register">
              <Button variant="outline" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Go to Admin Registration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            List of all admin users with access to the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !admins || admins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No admin users found. Invite your first admin partner!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Registration Method</TableHead>
                    <TableHead>Invited</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.email}>
                      <TableCell className="font-medium">{admin.email}</TableCell>
                      <TableCell>
                        {admin.registrationMethod === 'biometric' ? (
                          <Badge variant="default" className="gap-1">
                            <Fingerprint className="h-3 w-3" />
                            Biometric
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Globe className="h-3 w-3" />
                            Internet Identity
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(admin.invitationTimestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminUserManagementPage() {
  return (
    <AdminGuard>
      <AdminUserManagementContent />
    </AdminGuard>
  );
}
