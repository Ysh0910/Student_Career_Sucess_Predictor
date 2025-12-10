import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import PredictionForm from './components/PredictionForm';
import HistoryTable from './components/HistoryTable';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="dark">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-body">
          <Router>
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/predict" element={<PredictionForm />} />
                <Route path="/history" element={<HistoryTable />} />
              </Routes>
            </div>
            <Footer />
          </Router>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
