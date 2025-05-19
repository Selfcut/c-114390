
import { useAuth } from '@/lib/auth';

export const useAdminStatus = () => {
  const { user } = useAuth();
  
  // Use optional chaining to safely access properties
  const isAdmin = user?.isAdmin === true || user?.role === 'admin';
  const isModerator = user?.role === 'moderator';
  
  return {
    isAdmin,
    isModerator,
    isStaff: isAdmin || isModerator
  };
};
