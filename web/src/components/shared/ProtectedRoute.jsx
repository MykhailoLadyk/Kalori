import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  //   const { user, isLoading } = useUser();
  const isLoading = false;
  const user = true;
  const location = useLocation();
  if (isLoading) {
    return <div>Loading authentication session...</div>;
  }
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace // Replace the history entry so the back button doesn't trap the user
      />
    );
  }
  return <Outlet />;
}
