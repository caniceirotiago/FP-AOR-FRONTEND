import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '../../../services/userService'; 
import { FormattedMessage} from 'react-intl';
import useDialogModalStore from '../../../stores/useDialogModalStore';
import styles from './ResetPasswordForm.module.css';

const ResetPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token'); 
    const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } = useDialogModalStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setDialogMessage('Passwords do not match');
            setIsDialogOpen(true);
            setAlertType(true);
            setOnConfirm(async () => {
            });

            return;
        }
        try {
            console.log('token :', token);
            const response = await userService.resetPassword(token, password);
            console.log('response :', response);
            if (response.status === 204) {
                setDialogMessage('Password Changed Successfully');
                setIsDialogOpen(true);
                setAlertType(true);
                setOnConfirm(async () => {
                    navigate('/');
                });
                return;
            }
            const responseBody = await response.json();
            console.log('responseBody :', responseBody);
            
            setDialogMessage('Not able to change password, contact support.');
            setIsDialogOpen(true);
            setAlertType(true);
            setOnConfirm(async () => {
                navigate('/');
            });
        } catch (error) {
            console.error('Error :', error);
        }
    };

    return (
        <div className={styles.mainContent}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2><FormattedMessage id="changePassword">Change Password</FormattedMessage></h2>
                <label>
                    <FormattedMessage id="newPassword"> New Password:</FormattedMessage>
                    <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4}/>
                </label>
                <label>
                <FormattedMessage id="confirmPassword">Confirm Password:</FormattedMessage>
                    <input className={styles.input} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={4}/>
                </label>
                <button type="submit" className={styles.button}><FormattedMessage id="changePassword">Change Password</FormattedMessage></button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
