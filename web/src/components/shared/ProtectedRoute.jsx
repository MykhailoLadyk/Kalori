import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
export default function ProtectedRoute() {
  const { user, loading } = useUser();
  const userAuth = user?.userAuth;
  const userOnboarding = user?.completedOnboarding;
  const location = useLocation();
  if (loading) {
    return <div>Loading authentication session...</div>;
  }
  if (!userAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (userAuth && !userOnboarding) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
