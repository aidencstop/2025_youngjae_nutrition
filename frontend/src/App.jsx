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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/analyze" element={
          <PrivateRoute>
            <FoodAnalyze />
          </PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute>
            <IntakeHistory />
          </PrivateRoute>
        } />
        <Route path="/mypage" element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
