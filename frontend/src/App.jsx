import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/jsx/Navbar.jsx';
import RegistrationForm from './components/jsx/RegistrationForm';
import LoginForm from './components/jsx/LoginForm';
import HomePage from './components/jsx/HomePage';
import ChatLayout from './components/jsx/ChatLayout';
import Profile from './components/jsx/Profile.jsx';
import Settings from './components/jsx/Settings';
import GroupChatPage from './components/jsx/GroupChatPage.jsx';
import ChatPage from './components/jsx/ChatPage';
import UserList from './components/jsx/UserList.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

function PrivateRoute({ children, user }) {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isAuthenticated = user || storedUser;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationForm setUser={setUser} />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route
          path="/users"
          element={
            <PrivateRoute user={user}>
              <ChatLayout />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/chat/:receiverId"
          element={
            <PrivateRoute user={user}>
              <ChatLayout />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/chat/:type/:id"
          element={
            <PrivateRoute user={user}>
              <ChatLayout />
            </PrivateRoute>
          }
        />
        <Route path="/chat" element={<Navigate to="/users" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/chat/:receiverId" element={<ChatPage />} />
        {/* Redirect /chat to /users */}
        <Route path="/chat" element={<Navigate to="/users" replace />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;