import React, {useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useAuthStore from '../../stores/useAuthStore';
import userService from '../../services/userService';


const ProtectedRoute = ({ children }) => {
  const {isAuthenticated} = useAuthStore();
  const checkSession = async() => {
    const response = await userService.checkSession();
}

useEffect(() => {
    checkSession();
}
,[children]);
  
  if (!isAuthenticated) {
    sessionStorage.clear();
    return <Navigate to="/" />;
  }
  
  return children;
};

export default ProtectedRoute;
