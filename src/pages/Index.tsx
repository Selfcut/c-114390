
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to welcome page instead of causing infinite loop
  return <Navigate to="/welcome" replace />;
};

export default Index;
