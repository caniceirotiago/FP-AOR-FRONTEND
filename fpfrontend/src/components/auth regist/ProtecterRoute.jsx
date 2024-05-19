import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useAuthStore from '../../stores/useAuthStore';


const ProtectedRoute = ({ children }) => {
  const {isAuthenticated} = useAuthStore();
  
  if (!isAuthenticated) {
    sessionStorage.clear();
    return <Navigate to="/" />;
  }
  
  return children;
};

export default ProtectedRoute;
