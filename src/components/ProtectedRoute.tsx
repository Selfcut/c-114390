
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { PageLayout } from "./layouts/PageLayout";
import { Skeleton } from "./ui/skeleton";

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
  const isAdmin = user?.role === "admin" || user?.isAdmin;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <Skeleton className="h-4 w-24 bg-primary/20 rounded" />
        </div>
      </div>
    );
  }

  // If guest access is allowed, render the content directly
  if (allowGuests && !isAuthenticated) {
    return withLayout ? <PageLayout allowGuests>{children}</PageLayout> : <>{children}</>;
  }

  // If authentication is required but user is not authenticated
  if (!isAuthenticated && !allowGuests) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not an admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has the required permissions
  return withLayout ? <PageLayout>{children}</PageLayout> : <>{children}</>;
};
