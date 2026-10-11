import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    console.log('AdminAuthContext - Mount Check. isValid:', pb.authStore.isValid, 'model:', pb.authStore.model);
    
    // Check if user is authenticated and is admin on mount
    if (pb.authStore.isValid && pb.authStore.model) {
      const user = pb.authStore.model;
      console.log('AdminAuthContext - Mount Role:', user.role, '| Type:', typeof user.role);
      
      if (user.role === 'admin') {
        console.log('AdminAuthContext - Mount: User is admin, setting state.');
        setCurrentAdmin(user);
      } else {
        console.log('AdminAuthContext - Mount: User is NOT admin.');
      }
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AdminAuthContext - Attempting login for:', email);
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      
      console.log('AdminAuthContext - Login Success. Full User Object:', authData.record);
      
      const userRole = authData.record.role;
      console.log('AdminAuthContext - Role Value:', userRole, '| Type:', typeof userRole);
      
      if (userRole === undefined || userRole === null) {
        console.warn('AdminAuthContext - Warning: Role field is undefined or null on the user record.');
      }

      const isRoleAdmin = userRole === 'admin';
      console.log('AdminAuthContext - Role === "admin" comparison result:', isRoleAdmin);

      // Verify user is admin
      if (!isRoleAdmin) {
        console.log('AdminAuthContext - Access Denied. Clearing auth store.');
        pb.authStore.clear();
        throw new Error('Access denied. Admin privileges required.');
      }
      
      console.log('AdminAuthContext - Access Granted. Setting current admin.');
      setCurrentAdmin(authData.record);
      return { success: true };
    } catch (error) {
      console.error('AdminAuthContext - Login Error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    console.log('AdminAuthContext - Logging out.');
    pb.authStore.clear();
    setCurrentAdmin(null);
  };

  const isAdmin = () => {
    const check = currentAdmin !== null && currentAdmin.role === 'admin';
    return check;
  };

  const value = {
    currentAdmin,
    login,
    logout,
    isAdmin,
    initialLoading
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};