import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowGuests?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false, allowGuests = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin" || user?.isAdmin;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="h-4 w-24 bg-primary/20 rounded"></div>
        </div>
      </div>
    );
  }

  // If guest access is allowed, render the content directly
  if (allowGuests && !isAuthenticated) {
    return <>{children}</>;
  }

  // If authentication is required but user is not authenticated
  if (!isAuthenticated && !allowGuests) {
    return <Navigate to="/auth" replace />;
  }

  // If admin access is required but user is not an admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has the required permissions
  return <>{children}</>;
};
