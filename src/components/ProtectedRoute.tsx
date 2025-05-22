import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { PageLayout } from "./layouts/PageLayout";
import { Skeleton } from "./ui/skeleton";
import { LoadingScreen } from "./LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowGuests?: boolean;
  withLayout?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  allowGuests = false,
  withLayout = true 
}: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdmin = user?.isAdmin || user?.role === "admin";

  // Show loading state while authentication is being determined
  if (isLoading) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  // If guest access is allowed, render the content directly
  if (allowGuests && !isAuthenticated) {
    return withLayout ? <PageLayout allowGuests>{children}</PageLayout> : <>{children}</>;
  }

  // If authentication is required but user is not authenticated
  if (!isAuthenticated && !allowGuests) {
    // Save the current location so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If admin access is required but user is not an admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has the required permissions
  return withLayout ? <PageLayout>{children}</PageLayout> : <>{children}</>;
};
