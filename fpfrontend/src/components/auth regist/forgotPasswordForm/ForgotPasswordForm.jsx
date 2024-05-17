import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../../services/userService.jsx';
import styles from './ForgotPasswordForm.module.css';
import {FormattedMessage} from "react-intl";
import { FaKey } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useDialogModalStore from '../../../stores/useDialogModalStore';



const ForgotPasswordForm = () => {
    const navigate = useNavigate();
    const {setIsDialogOpen, setDialogMessage, setAlertType, setOnConfirm} = useDialogModalStore();
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await userService.requestPasswordReset(email);
            if (response.status === 204) {
                setDialogMessage('Recover password Email Sent');
                setIsDialogOpen(true);
                setAlertType(true);
                setOnConfirm(async () => {
                    navigate('/');
                });
                return;
            }
            const responseBody = await response.json();
            console.log('responseBody :', responseBody);
            if(responseBody.errorMessage === "You already requested a password reset, please check your email, wait" +
            " 30 minutes and try again, or contact the administrator"){
                setDialogMessage('You already requested a password reset, please check your email, wait30 minutes and try again, or contact the administrator');
            }
            else setDialogMessage('Not able to send email, contact support.');
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
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.banner}>
                    <FaKey className={styles.loginIcon}/>
                    <p className={styles.memberLoginBanner}><FormattedMessage id="recoverPassword">Recover Password</FormattedMessage></p>
                </div>
                <label htmlFor="email">Email</label>
                <input className={styles.input} type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button className={styles.button} type="submit"><FormattedMessage id="askForNewPassword">Ask for new password</FormattedMessage></button>
                <button className={styles.button} onClick={() => navigate('/')}><FormattedMessage id="backToLogin">Back to login</FormattedMessage></button>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
