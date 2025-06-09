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
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    console.log('Auth initializing from storage...', storedToken, storedUser);

    if (storedToken && storedUser) {
      setAuth({
        isAuthenticated: true,
        token: storedToken,
        user: JSON.parse(storedUser),
      });
    }

    setLoading(false); // <- mark loading complete
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
