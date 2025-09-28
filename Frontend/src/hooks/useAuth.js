import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('app_auth');
        if (authData) {
          const parsed = JSON.parse(authData);
          setUser(parsed.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('app_auth');
        localStorage.removeItem('token');
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthUpdate = () => checkAuth();
    window.addEventListener('auth:updated', handleAuthUpdate);
    
    return () => window.removeEventListener('auth:updated', handleAuthUpdate);
  }, []);

  const requireAuth = (redirectTo = '/login') => {
    if (!user && !loading) {
      navigate(redirectTo);
      return false;
    }
    return true;
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return { user, loading, requireAuth, getAuthHeader };
};