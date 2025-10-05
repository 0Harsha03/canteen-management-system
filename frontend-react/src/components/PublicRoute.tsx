import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is already logged in, redirect to their appropriate dashboard
  if (user && userRole) {
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (userRole === "staff") {
      return <Navigate to="/staff" replace />;
    } else if (userRole === "customer") {
      return <Navigate to="/order" replace />;
    }
  }

  // If not logged in, show the public page (login/signup)
  return <>{children}</>;
};