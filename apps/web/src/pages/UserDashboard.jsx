import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Trash2, Loader2, Award, Heart, ShoppingBag, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { LoadingSpinner } from '@/components/SharedComponents.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const TABS = [
  { key: 'orders', label: 'Orders', icon: ShoppingBag },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
  { key: 'points', label: 'Points', icon: Award },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settingsForm, setSettingsForm] = useState({ name: currentUser?.name || '', password: '', confirm: '' });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    setSettingsForm({ name: currentUser?.name || '', password: '', confirm: '' });
  }, [currentUser]);

  const loadTab = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'orders') {
        const res = await pb.collection('orders').getFullList({ sort: '-created', $autoCancel: false });
        setOrders(res);
      } else if (tab === 'wishlist') {
        const res = await pb.collection('wishlist').getFullList({ sort: '-created', $autoCancel: false });
        setWishlist(res);
      } else if (tab === 'points') {
        const res = await pb.collection('loyalty_points').getFullList({ sort: '-created', $autoCancel: false });
        setPoints(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab]);

  const removeWishlist = async (id) => {
    try {
      await pb.collection('wishlist').delete(id);
      setWishlist((prev) => prev.filter((w) => w.id !== id));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Could not remove item');
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const update = { name: settingsForm.name.trim() };
      if (settingsForm.password) {
        if (settingsForm.password.length < 8) {
          toast.error('Password must be at least 8 characters');
          setSavingSettings(false);
          return;
        }
        if (settingsForm.password !== settingsForm.confirm) {
          toast.error('Passwords do not match');
          setSavingSettings(false);
          return;
        }
        update.password = settingsForm.password;
        update.oldPassword = settingsForm.password;
      }
      await pb.collection('users').update(currentUser.id, update, { $autoCancel: false });
      toast.success('Settings updated');
      setSettingsForm({ name: update.name, password: '', confirm: '' });
    } catch (err) {
      toast.error('Could not update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const totalPoints = points.reduce((s, p) => s + (p.points || 0), 0);

  return (
    <>
      <Helmet>
        <title>My Account - STRONGBUILD</title>
        <meta name="description" content="View your STRONGBUILD order history, saved wishlist, loyalty points balance and account settings in one place." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="bg-secondary py-12 pt-32 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2">My Account</h1>
          <p className="text-primary">Welcome back, {currentUser?.name || currentUser?.email}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8 min-h-[50vh]">

        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 text-left px-4 py-3 rounded-sm font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === tab.key ? 'bg-accent text-white' : 'bg-transparent text-muted-foreground hover:bg-secondary hover:text-white'}`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
          <button onClick={logout} className="text-left px-4 py-3 text-red-500 font-bold uppercase tracking-wider text-sm hover:bg-secondary rounded-sm mt-4">
            Logout
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-secondary/30 rounded-lg border border-border p-6 md:p-8">
          {loading ? <LoadingSpinner /> : (
            <>
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Order History</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((o) => (
                        <div key={o.id} className="bg-black p-4 rounded-sm border border-border flex justify-between items-center">
                          <div>
                            <p className="font-bold text-white mb-1">#{(o.order_number || o.id.substring(0, 8)).toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">{new Date(o.created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {o.total_amount && <span className="text-white font-bold">₹{o.total_amount}</span>}
                            <span className="px-3 py-1 bg-secondary text-primary text-xs font-bold uppercase tracking-wider rounded-full border border-border/50">{o.status || 'Pending'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                      <Link to="/shop" className="inline-block bg-accent text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm">Start Shopping</Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Your Wishlist</h2>
                  {wishlist.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {wishlist.map((w) => (
                        <div key={w.id} className="bg-black p-4 rounded-sm border border-border flex gap-4 items-center">
                          <div className="h-16 w-16 rounded-sm overflow-hidden bg-secondary shrink-0">
                            {w.product_image && <img src={w.product_image} alt={w.product_title} className="h-full w-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${w.product_external_id}`} className="font-bold text-white hover:text-accent truncate block">{w.product_title || 'Saved item'}</Link>
                            {w.product_price && <p className="text-sm text-primary">{w.product_price}</p>}
                          </div>
                          <button onClick={() => removeWishlist(w.id)} className="text-muted-foreground hover:text-red-500 transition-colors" aria-label="Remove">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">Your wishlist is empty. Save gear you love by tapping the heart on any product.</p>
                      <Link to="/shop" className="inline-block bg-accent text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm">Browse Gear</Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'points' && (
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Loyalty Points</h2>
                  <div className="glass-panel rounded-2xl p-8 mb-8 text-center">
                    <Award className="h-10 w-10 text-accent mx-auto mb-3" />
                    <p className="text-5xl font-black text-white">{totalPoints}</p>
                    <p className="text-muted-foreground uppercase tracking-wider text-sm mt-2">Total points earned</p>
                  </div>
                  {points.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-2">History</h3>
                      {points.map((p) => (
                        <div key={p.id} className="bg-black p-4 rounded-sm border border-border flex justify-between items-center">
                          <div>
                            <p className="font-bold text-white capitalize">{p.earned_from || 'Earned'}</p>
                            <p className="text-sm text-muted-foreground">{new Date(p.created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <span className="text-accent font-bold">+{p.points}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Earn points on every purchase. Points appear here once your first order is confirmed.</p>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Account Settings</h2>
                  <form onSubmit={handleSettingsSave} className="max-w-md space-y-5">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Email</label>
                      <Input type="email" value={currentUser?.email || ''} disabled className="bg-black border-border rounded-sm h-12 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Full Name</label>
                      <Input type="text" value={settingsForm.name} onChange={(e) => setSettingsForm((f) => ({ ...f, name: e.target.value }))} className="bg-black border-border focus-visible:ring-accent rounded-sm h-12" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">New Password</label>
                      <Input type="password" value={settingsForm.password} onChange={(e) => setSettingsForm((f) => ({ ...f, password: e.target.value }))} placeholder="Leave blank to keep current" className="bg-black border-border focus-visible:ring-accent rounded-sm h-12" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Confirm New Password</label>
                      <Input type="password" value={settingsForm.confirm} onChange={(e) => setSettingsForm((f) => ({ ...f, confirm: e.target.value }))} className="bg-black border-border focus-visible:ring-accent rounded-sm h-12" />
                    </div>
                    <Button type="submit" disabled={savingSettings} className="bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wider rounded-sm flex items-center gap-2">
                      {savingSettings ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                    </Button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
