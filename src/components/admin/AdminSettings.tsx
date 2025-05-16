import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from "@/components/ui/button";

const AdminSettings = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  const handlePromoteUser = async () => {
    if (user?.email === 'test@example.com') {
      setMessage('Cannot promote test user.');
      return;
    }
    setMessage('Promoting user...');
  };

  return (
    <div>
      <h2>Admin Settings</h2>
      {message && <p>{message}</p>}
      <Button onClick={handlePromoteUser}>Promote User</Button>
    </div>
  );
};

export default AdminSettings;
