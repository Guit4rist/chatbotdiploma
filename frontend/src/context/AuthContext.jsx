// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  const [loading, setLoading] = useState(true); // <- add this

    useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false); // <- This is what was missing
      return;
    }

    try {
      const res = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const user = await res.json();
        setAuth({ isAuthenticated: true, token, user });
      } else {
        logout();
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);



  const login = (token, user) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ isAuthenticated: true, token, user });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAuth({ isAuthenticated: false, token: null, user: null });
  };

    return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        loading,
        user: auth.user,               // ✅ Add this
        isAuthenticated: auth.isAuthenticated, // ✅ Add this
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => useContext(AuthContext);
