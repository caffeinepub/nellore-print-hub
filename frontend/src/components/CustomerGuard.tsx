import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';

interface CustomerGuardProps {
  children: React.ReactNode;
}

export default function CustomerGuard({ children }: CustomerGuardProps) {
  const { isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/customer/login' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
