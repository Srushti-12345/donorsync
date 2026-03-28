import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DonorDashboard from "./pages/DonorDashboard";
import RequesterDashboard from "./pages/RequesterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoadingSpinner from "./components/LoadingSpinner";

const ProtectedRoute = ({ roles, children }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Preparing DonorSync..." />;
  }

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(auth.user.role)) {
    const fallback =
      auth.user.role === "admin" ? "/admin" : auth.user.role === "donor" ? "/donor" : "/requester";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

const HomeRedirect = () => {
  const { auth } = useAuth();
  if (!auth?.user) return <Navigate to="/login" replace />;
  if (auth.user.role === "admin") return <Navigate to="/admin" replace />;
  if (auth.user.role === "donor") return <Navigate to="/donor" replace />;
  return <Navigate to="/requester" replace />;
};

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/donor"
          element={
            <ProtectedRoute roles={["donor"]}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requester"
          element={
            <ProtectedRoute roles={["requester"]}>
              <RequesterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
