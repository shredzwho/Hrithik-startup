import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Key, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const AdminAccountSettings = () => {
  const navigate = useNavigate();
  const { currentAdmin, logout } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activityLog] = useState([
    { action: 'Admin login', timestamp: '2026-07-07 14:23:00', ip: '192.168.1.1' },
    { action: 'Updated user record', timestamp: '2026-07-07 13:45:00', ip: '192.168.1.1' },
    { action: 'Created new product', timestamp: '2026-07-07 12:10:00', ip: '192.168.1.1' },
    { action: 'Admin login', timestamp: '2026-07-06 09:15:00', ip: '192.168.1.1' }
  ]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      // Verify current password by attempting to authenticate
      await pb.collection('users').authWithPassword(currentAdmin.email, currentPassword, { $autoCancel: false });
      
      // Update password
      await pb.collection('users').update(currentAdmin.id, {
        password: newPassword,
        passwordConfirm: confirmPassword
      }, { $autoCancel: false });

      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  return (
    <>
      <Helmet>
        <title>Account Settings</title>
        <meta name="description" content="Admin account settings" />
      </Helmet>

      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground heading-balance">Account Settings</h1>
          <p className="text-muted-foreground">Manage your admin account preferences</p>
        </div>

        {/* Admin Info */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="w-5 h-5" />
              Admin Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-lg font-medium text-foreground">{currentAdmin?.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Role</Label>
              <p className="text-lg font-medium text-foreground">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm">
                  Administrator
                </span>
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Account Created</Label>
              <p className="text-lg font-medium text-foreground">
                {new Date(currentAdmin?.created).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Key className="w-5 h-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-foreground">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="bg-muted text-foreground"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-foreground">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="bg-muted text-foreground"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-foreground">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="bg-muted text-foreground"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLog.map((activity, index) => (
                <div key={index} className="flex justify-between items-start py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">IP: {activity.ip}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="luxury-card border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <LogOut className="w-5 h-5" />
              Logout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Sign out of your admin account. You will need to log in again to access the admin panel.
            </p>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminAccountSettings;