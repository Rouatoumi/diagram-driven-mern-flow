import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spinner } from "./ui/spinner";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();
  
    console.log('ProtectedRoute - user:', user, 'loading:', loading); // Debug
  
    if (loading) return <Spinner />;
    if (!user) {
      console.log('Redirecting to login from:', location.pathname);
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return <Outlet />;
  }