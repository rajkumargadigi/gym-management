import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for logged in user on load
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // Login User
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Register User
  const register = async (name, email, phone, password, role = 'user') => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await API.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role,
      });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Update user state (for dashboard profile edits, membership updates, etc.)
  const updateUserState = (updatedUser) => {
    // Keep the token if not returned
    const currentInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const newInfo = { ...currentInfo, ...updatedUser };
    setUser(newInfo);
    localStorage.setItem('userInfo', JSON.stringify(newInfo));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        login,
        register,
        logout,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
