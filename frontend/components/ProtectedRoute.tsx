'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // If role is required and user doesn't have it, redirect to unauthorized
      if (requiredRole && user?.role !== requiredRole) {
        router.push('/unauthorized');
        return;
      }

      // If we get here, user is authorized
      setAuthorized(true);
    }
  }, [isAuthenticated, loading, requiredRole, router, user]);

  // Show loading state while checking auth status
  if (loading || !authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If authorized, render the children
  return <>{children}</>;
}
