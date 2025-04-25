import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ListPage from "./pages/ListPage";
import Recipes from "./pages/RecipesPage";
import HubPage from "./pages/HubPage";
import AuthForm from "./components/Auth/Authform";
import { supabase } from "./utils/supabase"; // Import your Supabase client
import { Session } from '@supabase/supabase-js'; // Import the Session type

function App() {
  const [session, setSession] = useState<Session | null>(null); // Update the type of session
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loadingSession) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <Router>
      <AppProvider userId={session?.user?.id}>
        {" "}
        {/* Pass userId to AppContext */}
        <Routes>
          <Route
            path="/login"
            element={session ? <Navigate to="/" replace /> : <AuthForm />}
          />
          <Route
            path="/"
            element={
              session ? (
                <Layout>
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/list"
            element={
              session ? (
                <Layout>
                  <ListPage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/Recipes"
            element={
              session ? (
                <Layout>
                  <Recipes />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/hub"
            element={
              session ? (
                <Layout>
                  <HubPage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
