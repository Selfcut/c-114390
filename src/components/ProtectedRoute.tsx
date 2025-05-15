
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowGuests?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  allowGuests = false
}) => {
  const { user, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If guests are allowed, render the page regardless of authentication
  if (allowGuests) {
    return <>{children}</>;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If admin access is required but user is not an admin, redirect to dashboard
  if (requireAdmin && !(user.role === 'admin' || user.isAdmin)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Render the protected content
  return <>{children}</>;
};
