import React, {useEffect} from 'react';
import useAuthStore from '../../stores/useAuthStore';



const ProtectedComponents = ({ children }) => {
  const {isAuthenticated} = useAuthStore();



  return isAuthenticated ? children : null;
};

export default ProtectedComponents;
