
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const useAdminStatus = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    // For demo purposes, we'll consider any user with email containing "admin" as an admin
    // In a real application, this would be a proper role check
    if (user?.email?.includes('admin')) {
      setIsAdmin(true);
    }
  }, [user]);

  return { isAdmin };
};
