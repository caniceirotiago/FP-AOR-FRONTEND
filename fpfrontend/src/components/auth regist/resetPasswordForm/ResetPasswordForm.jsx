import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '../../../services/userService'; 
import { FormattedMessage} from 'react-intl';
import useDialogModalStore from '../../../stores/useDialogModalStore';
import styles from './ResetPasswordForm.module.css';
import { validatePassword } from '../../../utils/validators/userValidators';

const ResetPasswordForm = () => {
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token'); 
    const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } = useDialogModalStore();
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
        if (name === 'password') {
            checkPasswordStrength(value);
            if (!validatePassword(value)) {
                setPasswordError('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
              } else {
                setPasswordError('');
              }
        }
    };

    const checkPasswordStrength = (password) => {
        if (!password) {
        setPasswordStrength(0);
        } else if (validatePassword(password)) {
        setPasswordStrength(3);
        } else {
        setPasswordStrength(2);
        }
     };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('passwords :', passwords);
        if (passwords.password !== passwords.confirmPassword) {
            setDialogMessage('Passwords do not match');
            setIsDialogOpen(true);
            setAlertType(true);
            setOnConfirm(async () => {
            });
            return;
        } else if (passwordStrength !== 3) {
            setDialogMessage('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
            setIsDialogOpen(true);
            setAlertType(true);
            setOnConfirm(async () => {
            });
            return;
        }
        try {
            const response = await userService.resetPassword(token, passwords.password);
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
                    <input name="password" className={styles.input} type="password" value={passwords.password} onChange={handleChange} required minLength={4}/>
                </label>
                {passwordStrength === 2 && (
                     <div className={styles.passwordStrength} style={{ color: 'yellow' }}>
                        <FormattedMessage id="weakPassword" />
                     </div>
                     )}
                     {passwordStrength === 3 && (
                     <div className={styles.passwordStrength} style={{ color: 'green' }}>
                        <FormattedMessage id="strongPassword" />
                     </div>
                     )}
                <label>
                <FormattedMessage id="confirmPassword">Confirm Password:</FormattedMessage>
                    <input name="confirmPassword" className={styles.input} type="password" value={passwords.confirmPassword} onChange={handleChange} required minLength={4}/>
                </label>
                <button type="submit" className={styles.button}><FormattedMessage id="changePassword">Change Password</FormattedMessage></button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
