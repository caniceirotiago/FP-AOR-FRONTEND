import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import DialogModalStore from '../../stores/useDialogModalStore';

const EmailConfirmationPage = () => {
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
              const response = await userService.confirmAccount(token); 
              console.log('Response:', response.status);
              if(response.status === 204) {
                  setDialogMessage('Acount Confirmed!');
                  setIsDialogOpen(true);
                  setAlertType(true);
                  setOnConfirm(async () => {
                      navigate('/');
              });
              }else{
                  setDialogMessage('Error Confirming Account!');
                  setIsDialogOpen(true);
                  setAlertType(true);
                  setOnConfirm(async () => {
                      navigate('/');
                  });
              }
            
          } catch (error) {
              console.error('Error:', error);
              setDialogMessage('Error Confirming Account! ' + {error});
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

export default EmailConfirmationPage;
