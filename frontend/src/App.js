import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // SỬA LỖI: Thêm useLocation
import Header from './component/header/Header';
import HomeMenu from './component/home/HomeMenu';
import HomePage from './component/home/HomePage';
import Topic from './component/learn/Topic';
import Lesson from './component/learn/Lesson';
import Flashcard from './component/learn/Flashcard';
import Test from './component/test/Test';
import TestStart from './component/test/TestStart';
import SearchPage from './component/search/SearchPage';
import Login from './component/account/Login';
import Signup from './component/account/Signup';
import ProtectedRoute from './component/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const AppLayout = () => {
  const location = useLocation(); // SỬA LỖI: Sử dụng useLocation hook

  // Danh sách các route không cần header và sidebar
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {/* Chỉ hiển thị header khi không phải auth routes */}
      {!isAuthRoute && (
        <div className="header-container">
          <Header />
        </div>
      )}

      <div className="main-container" style={{ display: 'flex' }}>
        {/* Chỉ hiển thị sidebar khi không phải auth routes */}
        {!isAuthRoute && (
          <div className="sideber-container">
            <HomeMenu />
          </div>
        )}

        {/* Content container - full width cho auth routes */}
        <div
          className="conten-container"
          style={{
            flex: 1,
            ...(isAuthRoute && { width: '100%', minHeight: '100vh' })
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/topics"
              element={
                <ProtectedRoute>
                  <Topic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn"
              element={
                <ProtectedRoute>
                  <Topic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lessons"
              element={
                <ProtectedRoute>
                  <Lesson />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcard"
              element={
                <ProtectedRoute>
                  <Flashcard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <Test />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tests"
              element={
                <ProtectedRoute>
                  <Test />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-start"
              element={
                <ProtectedRoute>
                  <TestStart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dotests"
              element={
                <ProtectedRoute>
                  <TestStart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
