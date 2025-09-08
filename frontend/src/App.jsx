import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FoodAnalyze from './components/FoodAnalyze';
import IntakeHistory from './components/IntakeHistory';
import MyPage from './components/MyPage';
import PrivateRoute from './routes/PrivateRoute';
import Navbar from './components/NavBar';  // ✅ 추가
import './styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <>
              <Navbar />
              <Dashboard />
            </>
          </PrivateRoute>
        } />
        <Route path="/analyze" element={
          <PrivateRoute>
            <>
              <Navbar />
              <FoodAnalyze />
            </>
          </PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute>
            <>
              <Navbar />
              <IntakeHistory />
            </>
          </PrivateRoute>
        } />
        <Route path="/mypage" element={
          <PrivateRoute>
            <>
              <Navbar />
              <MyPage />
            </>
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
