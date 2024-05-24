import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import {FormattedMessage} from "react-intl";
import { FaEnvelope } from 'react-icons/fa';
import userService from '../../../services/userService';
import styles from './ResendEmailForm.module.css';
import DialogModalStore from '../../../stores/useDialogModalStore';
import Button from '../../buttons/landingPageBtn/Button.jsx';




const ResendEmailForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await userService.requestNewConfirmationEmail(email);
            if (response.status === 204) {
                DialogModalStore.getState().setDialogMessage('Confirmation Email Sent');
                DialogModalStore.getState().setIsDialogOpen(true);
                DialogModalStore.getState().setAlertType(true);
                DialogModalStore.getState().setOnConfirm(async () => {
                    navigate('/');
                });
                return;
            }
            const responseBody = await response.json();
            console.log('responseBody :', responseBody);
            if(responseBody.errorMessage === "You can't request a new confirmation email now, please wait 1 minute"){
                DialogModalStore.getState().setDialogMessage('You can not request a new confirmation email now, please wait 1 minute');
            }
            else DialogModalStore.getState().setDialogMessage('Not able to send confirmation email, contact support.');
            DialogModalStore.getState().setIsDialogOpen(true);
            DialogModalStore.getState().setAlertType(true);
            DialogModalStore.getState().setOnConfirm(async () => {
                navigate('/');
            });
        } catch (error) {
            console.error('Error :', error);
        }
    };

    return (
        <div className={styles.mainContent}>
            <form  className={styles.form}>
                <div className={styles.banner}>
                    <FaEnvelope className={styles.loginIcon}/>
                    <p className={styles.memberLoginBanner}><FormattedMessage id="resendConfirmationEmail">Resend Confirmation Email</FormattedMessage></p>
                </div>
                <label htmlFor="email">Email</label>
                <input className={styles.input} type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div className={styles.btnDiv}>
                    <Button onClick={handleSubmit} tradId="askForNewConfirmation" defaultText="Ask For New Confirmation" btnColor={"var(--btn-color2)"}/>
                  <Button onClick={() => navigate('/')} tradId="back" defaultText="Back" btnColor={"var(--btn-color2)"}/>
                </div>
            </form>
        </div>
    );
};

export default ResendEmailForm;
