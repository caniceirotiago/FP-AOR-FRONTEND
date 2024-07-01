import React, {useEffect} from 'react';
import useAuthStore from '../../stores/useAuthStore';



const ProtectedComponentsByRole = ({ children }) => {
  const roleId = localStorage.getItem('role');
  return (roleId == 1) ? children : null;
};

export default ProtectedComponentsByRole;
