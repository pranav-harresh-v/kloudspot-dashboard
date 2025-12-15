import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// 1. Lazy Load Dashboard & Entries (You already did this)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Entries = lazy(() => import("./pages/Entries"));

// 2. NEW: Lazy Load the Layout (Removes Icons/Sidebar from Login load)
const Layout = lazy(() => import("./components/Layout"));

// 3. NEW: Lazy Load Context (Removes Socket.io from Login load)
// Since SiteProvider is a named export { SiteProvider }, we use this helper syntax:
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
        {/* Login loads FAST because it has 0 heavy dependencies now */}
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              {/* Suspense is needed because SiteProvider and Layout are now async */}
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
