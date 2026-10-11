import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === '/signup';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/account';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Login successful');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (!form.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setLoading(true);
    try {
      await signup({ name: form.name.trim(), email: form.email, password: form.password });
      toast.success('Account created. Welcome to STRONGBUILD.');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.email?.message || 'Could not create account. That email may already be registered.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isSignup ? 'Create Account' : 'Login'} - STRONGBUILD</title>
        <meta name="description" content={isSignup ? 'Create your STRONGBUILD account to track orders, save your wishlist and earn loyalty points.' : 'Log in to your STRONGBUILD account.'} />
      </Helmet>
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-32">
        <div className="max-w-md w-full luxury-card p-8 rounded-lg">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2 text-center">
            {isSignup ? 'Create Account' : 'Login'}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {isSignup ? 'Join the ranks. Track orders, save gear, earn points.' : 'Access your orders, wishlist, and points.'}
          </p>

          {isSignup ? (
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Full Name</label>
                <Input type="text" name="name" required value={form.name} onChange={handleChange} className="bg-black border-border focus-visible:ring-accent rounded-sm h-12" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Email</label>
                <Input type="email" name="email" required value={form.email} onChange={handleChange} className="bg-black border-border focus-visible:ring-accent rounded-sm h-12" placeholder="you@email.com" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Password</label>
                <Input type="password" name="password" required value={form.password} onChange={handleChange} className="bg-black border-border focus-visible:ring-accent rounded-sm h-12" placeholder="Min 8 characters" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Confirm Password</label>
                <Input type="password" name="confirm" required value={form.confirm} onChange={handleChange} className="bg-black border-border focus-visible:ring-accent rounded-sm h-12" placeholder="Re-enter password" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold tracking-widest uppercase rounded-sm flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Creating...</> : 'Create Account'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Email</label>
                <Input type="email" name="email" required value={form.email} onChange={handleChange} className="bg-black border-border focus-visible:ring-accent rounded-sm h-12" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-primary mb-2">Password</label>
                <Input type="password" name="password" required value={form.password} onChange={handleChange} className="bg-black border-border focus-visible:ring-accent rounded-sm h-12" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold tracking-widest uppercase rounded-sm flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Logging in...</> : 'Sign In'}
              </Button>
            </form>
          )}

          <p className="mt-8 text-center text-muted-foreground text-sm">
            {isSignup ? (
              <>Already have an account? <Link to="/login" className="text-white hover:text-accent font-bold uppercase tracking-wider">Login Here</Link></>
            ) : (
              <>Don't have an account? <Link to="/signup" className="text-white hover:text-accent font-bold uppercase tracking-wider">Register Here</Link></>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
