import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const AdminProtectedRoute = ({ children }) => {
  const { currentAdmin, initialLoading, isAdmin } = useAdminAuth();

  useEffect(() => {
    if (!initialLoading) {
      console.log('AdminProtectedRoute - Auth Check:');
      console.log('1. Is Authenticated (currentAdmin exists):', !!currentAdmin);
      console.log('2. User Role Value:', currentAdmin?.role);
      console.log('3. isAdmin() Check Passes:', isAdmin());
    }
  }, [currentAdmin, initialLoading, isAdmin]);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!currentAdmin) {
    console.log('AdminProtectedRoute - No currentAdmin, redirecting to login.');
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin()) {
    console.log('AdminProtectedRoute - currentAdmin exists but isAdmin() is false. Blocking access.');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You do not have admin privileges to access this area.</p>
          <a href="/" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;