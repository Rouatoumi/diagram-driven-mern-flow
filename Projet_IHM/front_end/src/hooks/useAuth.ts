import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  const user = localStorage.getItem('user')
  console.log('useAuth - user:', user);
  context.user = user ? JSON.parse(user) : null;
  console.log('useAuth - context:', context);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
