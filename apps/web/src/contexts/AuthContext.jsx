import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        if (pb.authStore.isValid) {
          const refreshPromise = pb.collection('users').authRefresh({ $autoCancel: false });
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Auth refresh timeout')), 4000);
          });
          await Promise.race([refreshPromise, timeoutPromise]);
          if (!cancelled) {
            setCurrentUser(pb.authStore.model);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        // Keep existing session on timeout; only clear on real auth failures
        if (err?.message !== 'Auth refresh timeout') {
          pb.authStore.clear();
          if (!cancelled) {
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        } else if (!cancelled) {
          setCurrentUser(pb.authStore.model);
          setIsAuthenticated(pb.authStore.isValid);
        }
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    };

    checkAuth();

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
      setIsAuthenticated(!!model);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      return authData;
    } catch (error) {
      console.error("Login Error", error);
      throw error;
    }
  };

  const signup = async (data) => {
    try {
      const record = await pb.collection('users').create({
        ...data,
        emailVisibility: true,
      }, { $autoCancel: false });
      
      // Auto login after signup
      if (record) {
        await login(data.email, data.password);
      }
      return record;
    } catch (error) {
      console.error("Signup Error", error);
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    toast.success('Logged out successfully');
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    signup,
    logout,
    initialLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};