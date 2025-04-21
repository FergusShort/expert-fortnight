import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import RecommendationsPage from './pages/RecommendationsPage';
import HubPage from './pages/HubPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/hub" element={<HubPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;