import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);

  // Internet Identity provider URL
  const getIdentityProvider = () => {
    if (process.env.DFX_NETWORK === 'ic') {
      return 'https://identity.ic0.app';
    }
    
    // For local development, use the canister ID from environment
    const canisterId = process.env.CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaaa-aaadq-cai';
    return `http://${canisterId}.localhost:4943`;
  };

  const identityProvider = getIdentityProvider();

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true,
        },
      });
      setAuthClient(client);

      const authenticated = await client.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const identity = client.getIdentity();
        setIdentity(identity);
        setPrincipal(identity.getPrincipal().toString());
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    if (!authClient) return;

    try {
      setLoading(true);
      
      await authClient.login({
        identityProvider,
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setIdentity(identity);
          setIsAuthenticated(true);
          setPrincipal(identity.getPrincipal().toString());
          setLoading(false);
          console.log('Login successful, Principal:', identity.getPrincipal().toString());
        },
        onError: (error: string) => {
          console.error('Login failed:', error);
          setLoading(false);
        },
        // Create popup window for authentication
        windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=600,left=100,top=100',
      });
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      setLoading(true);
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    identity,
    login,
    logout,
    loading,
    principal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};