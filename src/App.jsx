import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Entries = lazy(() => import("./pages/Entries"));

const Layout = lazy(() => import("./components/Layout"));

const SiteProviderLazy = lazy(() =>
  import("./context/SiteContext").then((module) => ({
    default: module.SiteProvider,
  }))
);

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    Loading App...
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <SiteProviderLazy>
                  <Layout />
                </SiteProviderLazy>
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/entries" element={<Entries />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
