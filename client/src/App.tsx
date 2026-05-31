import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ProtectedRoute } from "@/components/Layout/ProtectedRoute";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { AuthProvider } from "@/lib/auth";

const Landing = lazy(async () => {
  const module = await import("@/pages/Landing");
  return { default: module.Landing };
});
const Dashboard = lazy(async () => {
  const module = await import("@/pages/Dashboard");
  return { default: module.Dashboard };
});
const SignIn = lazy(async () => {
  const module = await import("@/pages/SignIn");
  return { default: module.SignIn };
});
const SignUp = lazy(async () => {
  const module = await import("@/pages/SignUp");
  return { default: module.SignUp };
});
const ForgotPassword = lazy(async () => {
  const module = await import("@/pages/ForgotPassword");
  return { default: module.ForgotPassword };
});
const VerifyEmail = lazy(async () => {
  const module = await import("@/pages/VerifyEmail");
  return { default: module.VerifyEmail };
});
const EditorPage = lazy(async () => {
  const module = await import("@/pages/Editor");
  return { default: module.EditorPage };
});
const AuthCallback = lazy(async () => {
  const module = await import("@/pages/AuthCallback");
  return { default: module.AuthCallback };
});
const PrivacyPolicy = lazy(async () => {
  const module = await import("@/pages/PrivacyPolicy");
  return { default: module.PrivacyPolicy };
});
const TermsOfService = lazy(async () => {
  const module = await import("@/pages/TermsOfService");
  return { default: module.TermsOfService };
});
const SettingsPage = lazy(async () => {
  const module = await import("@/pages/Settings");
  return { default: module.Settings };
});
const Overview = lazy(async () => {
  const module = await import("@/pages/Overview");
  return { default: module.Overview };
});
const SessionsPage = lazy(async () => {
  const module = await import("@/pages/SessionsPage");
  return { default: module.SessionsPage };
});
const Analytics = lazy(async () => {
  const module = await import("@/pages/Analytics");
  return { default: module.Analytics };
});

export default function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <main className="flex min-h-screen items-center justify-center bg-page-texture px-6">
            <div className="text-center">
              <BrandLogo size="lg" className="justify-center" />
              <h1 className="mt-6 font-display text-5xl text-charcoal-dark">Loading the private desk.</h1>
            </div>
          </main>
        }
      >
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/verify-email"
            element={
              <ProtectedRoute>
                <VerifyEmail />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Navigate to="/signin" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:sessionId"
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            }
          />
          <Route path="/editor" element={<Navigate to="/editor/session-2048" replace />} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions"
            element={
              <ProtectedRoute>
                <SessionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
