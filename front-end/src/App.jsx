import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppLayout from "./ui/AppLayout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRoute from "./ui/PrivateRoute";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Certificates from "./pages/Certificates";
import Roadmaps from "./pages/Roadmaps";
import Roadmap from "./features/content/Roadmap";
import Stage from "./features/content/Stage";
import Appointements from "./pages/Appointements";
import { UiContextProvider } from "./context/UiContext";
import AddRoadmap from "./features/content/AddRoadmap";
import VerifyEmail from "./pages/VerifyEmail";
import AdminContentManagers from "./ui/AdminContentManagers";
import AdminAcademies from "./ui/AdminAcademies";
import Settings from "./pages/Settings";
import BookAppointment from "./features/content/BookAppointment";
import PendingAppointments from "./features/content/PendingAppointments";
import AcceptedAppointments from "./features/content/AcceptedAppointments";
import CompletedAppointments from "./features/content/CompletedAppointments";
import Recommendations from "./pages/Recommendations";
import { TranslationProvider } from "./context/TranslationContext";
import HelpCenter from "./pages/HelpCenter";
import Faqs from "./pages/Faqs";
import TermsOfService from "./pages/TermsOfService";

function App() {
  return (
    <Router>
      <TranslationProvider>
        <AuthProvider>
          <UiContextProvider>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route
                  path="dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/content-managers"
                  element={
                    <PrivateRoute>
                      <AdminContentManagers />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/academies"
                  element={
                    <PrivateRoute>
                      <AdminAcademies />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="certificates"
                  element={
                    <PrivateRoute>
                      <Certificates />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="book-appointment/:roadmapId"
                  element={
                    <PrivateRoute>
                      <BookAppointment />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="appointments"
                  element={
                    <PrivateRoute>
                      <Appointements />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="recommendations"
                  element={
                    <PrivateRoute>
                      <Recommendations />
                    </PrivateRoute>
                  }
                />
                <Route path="roadmaps" element={<Roadmaps />} />
                <Route
                  path="roadmaps/:roadmapId/stage/:stageNumber"
                  element={
                    <PrivateRoute>
                      <Stage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="add-roadmap"
                  element={
                    <PrivateRoute>
                      <AddRoadmap />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="academy/pending-appointments"
                  element={
                    <PrivateRoute>
                      <PendingAppointments />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="academy/accepted-appointments"
                  element={
                    <PrivateRoute>
                      <AcceptedAppointments />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="academy/completed-appointments"
                  element={
                    <PrivateRoute>
                      <CompletedAppointments />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
                <Route path="help" element={<HelpCenter />} />
                <Route path="faqs" element={<Faqs />} />
                <Route path="terms" element={<TermsOfService />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
              </Route>

              <Route path="roadmaps/:roadmapId" element={<Roadmap />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              <Route path="*" element={<Error error={"404 not found"} />} />
            </Routes>

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  padding: "16px",
                  borderRadius: "12px",
                  fontFamily: "var(--font-body)",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  backgroundColor: "var(--color-primary-600)",
                  boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                },
              }}
            />
          </UiContextProvider>
        </AuthProvider>
      </TranslationProvider>
    </Router>
  );
}

export default App;
