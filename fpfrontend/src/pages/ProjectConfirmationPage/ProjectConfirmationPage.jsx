import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import DialogModalStore from '../../stores/useDialogModalStore';

const ProjectConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm} = DialogModalStore();

  useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token'); 

      if (!token) {
          console.error('Token not received');
          setDialogMessage('Error Confirming Account! Token not received!');
                  setIsDialogOpen(true);
                  setAlertType(true);
                  setOnConfirm(async () => {
                      navigate('/');
                  });
          navigate('/'); 
          return;
      }
      const performConfirmation = async () => {
          try {
              const response = await userService.confirmProjectAssociation(token); 
              if(response.status === 204) {
                  setDialogMessage('Associated with project!');
                  setIsDialogOpen(true);
                  setAlertType(true);
                  setOnConfirm(async () => {
                      navigate('/');
              });
              }else{
                  setDialogMessage('Error associating user to project!');
                  setIsDialogOpen(true);
                  setAlertType(true);
                  setOnConfirm(async () => {
                      navigate('/');
                  });
              }
            
          } catch (error) {
              console.error('Error:', error);
              setDialogMessage('Error associating user to project! ' + {error});
                  setIsDialogOpen(true);
                  setAlertType(true);
                  setOnConfirm(async () => {
                      navigate('/');
                  });
          }
      };

      performConfirmation();
  }, [navigate, location.search]);

  return (
      <div className="confirmationPage">
          <div></div> 
      </div>
  );
};

export default ProjectConfirmationPage;
