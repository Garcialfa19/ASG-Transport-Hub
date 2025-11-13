'use client';

import { useContext } from 'react';
import { AuthContext } from '@/lib/firebase/provider';
import type { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
