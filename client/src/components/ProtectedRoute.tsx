// client/src/components/ProtectedRoute.tsx

'use client';

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '@/context/AuthContext';
import Spinner from './Spinner'; // Import the new Spinner

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Spinner />; 
  }
  
  const { isAuthenticated, isLoading } = authContext;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // While loading, show the spinner
  if (isLoading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;