import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ComparisonProvider } from './context/ComparisonContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PropertyComparisonBar from './components/PropertyComparisonBar';
import PropertyComparisonModal from './components/PropertyComparisonModal';
import { Building2 } from 'lucide-react';

// Lazy loaded page components
const HomePage = lazy(() => import('./pages/HomePage'));
const ListingsPage = lazy(() => import('./pages/ListingsPage'));
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetailsPage'));
const CreateEditPropertyPage = lazy(() => import('./pages/CreateEditPropertyPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AIPropertyHubPage = lazy(() => import('./pages/AIPropertyHubPage'));

// Fallback Loader
const PageLoader = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center">
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sapphire-600 via-sapphire-700 to-slate-900 flex items-center justify-center text-white shadow-sapphire animate-bounce">
      <Building2 className="w-7 h-7" />
    </div>
    <div className="mt-4 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-sapphire-600 animate-ping" />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
        Curating BuyYourProperty Portfolios...
      </p>
    </div>
  </div>
);

export const App: React.FC = () => {
  const isAiHubEnabled = import.meta.env.VITE_ENABLE_AI_HUB !== 'false';

  return (
    <AuthProvider>
      <CurrencyProvider>
        <FavoritesProvider>
          <ComparisonProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sapphire-600 selection:text-white">
                <Navbar />

                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/properties" element={<ListingsPage />} />
                      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                      {/* Optional AI Property Hub (Feature Flagged) */}
                      {isAiHubEnabled && (
                        <Route path="/ai-hub" element={<AIPropertyHubPage />} />
                      )}

                      {/* Protected Routes */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <DashboardPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/properties/new"
                        element={
                          <ProtectedRoute>
                            <CreateEditPropertyPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/properties/edit/:id"
                        element={
                          <ProtectedRoute>
                            <CreateEditPropertyPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* 404 Catch-All */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </main>

                {/* Floating Property Comparison Dock & Modal */}
                <PropertyComparisonBar />
                <PropertyComparisonModal />

                <Footer />
              </div>
            </Router>
          </ComparisonProvider>
        </FavoritesProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
};

export default App;
