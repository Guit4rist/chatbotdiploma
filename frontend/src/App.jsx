import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/HomePage';
import Chat from './pages/ChatPage';
import Login from './pages/LoginPage';
import Profile from './pages/ProfilePage';
import Settings from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/RegisterPage';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useAuth } from './context/AuthContext';
import LessonsPage from './pages/LessonsPage';

function App() {
  const { user, isAuthenticated, loading } = useAuth(); // 👈 get loading state

  if (loading) {
  return (
    <div style={{ paddingTop: '5rem', textAlign: 'center', fontSize: '1.2rem' }}>
      Loading authentication...
    </div>
  );
  }

  
  console.log("Auth loaded:", { user, isAuthenticated });

  return (
    <ParallaxProvider>
      <>
        <Navbar />
        <main className="pt-16 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/lessons" element={<LessonsPage />} />
          </Routes>
        </main>
      </>
    </ParallaxProvider>
  );
}

export default App;
