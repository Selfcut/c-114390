
import { useAuth } from '@/lib/auth';

export const useAdminStatus = () => {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;
  const isModerator = user?.role === 'moderator';
  
  return {
    isAdmin,
    isModerator,
    isStaff: isAdmin || isModerator
  };
};
