import React, {useState} from 'react'
import useLoginModalStore from '../../stores/useLoginModalStore.jsx'
import styles from './LoginModal.module.css'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import userService from '../../services/userService'
import useAuthStore from '../../stores/useAuthStore.jsx'
import useDialogModalStore from  '../../stores/useDialogModalStore.jsx'
import Button from '../buttons/landingPageBtn/Button.jsx'


const LoginModal = () => {
    const {isLoginModalOpen, setIsLoginModalOpen} = useLoginModalStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {login} = useAuthStore();
    const { setIsDialogOpen, setDialogMessage, setAlertType, setOnConfirm} = useDialogModalStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await userService.login(email, password);
            if(response.status === 200){
                handleSussefulLogin();
            } else {
                console.error('Login failed:', response);
                setDialogMessage('Invalid Credentials. Please try again.');
                setAlertType(true);
                setIsDialogOpen(true);
                setOnConfirm(() => setIsDialogOpen(false));
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
    const handleSussefulLogin = async () => {
        const response = await userService.fetchUserBasicInfo();
        const data = await response.json();
        if(data){
            localStorage.setItem('photo', data.photo);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.id);
            setIsLoginModalOpen(false); 
            login();
            navigate('/authenticatedhomepage');
        }
    }
    const handleSignUpNavigation = (event) => {
        setIsLoginModalOpen(false);
        navigate('/register');
    }
    const handleForgotPasswordNavigation = (event) => {
        setIsLoginModalOpen(false);
        navigate('/forgot-password');
    }
    const handleResendEmail = (event) => {
        setIsLoginModalOpen(false);
        navigate('/request/newemail');
    }
    const handleOnClose = (event) => {
        setIsLoginModalOpen(false);
    }

    if(!isLoginModalOpen) return null;
    return(<>
        <div className={styles.mainContentModal} >
            <div className={styles.modal}>
                <form id="loginForm" className={styles.form}>
                    <div className={styles.banner}>
                        <div className={styles.closeButtonGhost}>X</div>
                        <p className={styles.memberLoginBanner}><FormattedMessage id="memberLogin">Member Login</FormattedMessage></p>
                        <div  onClick={handleOnClose} className={styles.closeButton}>X</div>
                    </div>
                    <div className={styles.content}>
                        <label htmlFor="email" className={styles.label}><FormattedMessage id="email">Email</FormattedMessage></label>
                        <input className={styles.input} type="email" name="email" id="email" maxLength="100" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="password" className={styles.label}><FormattedMessage id="password">Password</FormattedMessage></label>
                        <input className={styles.input} type="password" name="password" id="password" maxLength="25" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button onClick={handleLogin} tradId="login" defaultText="Login" btnColor={"var(--btn-color2)"} />
                    </div>
                </form>
                <div className={styles.otherOptions}>
                    <div className={styles.signup}>
                        <FormattedMessage id="dontHaveAnAccount">Don't have an account?</FormattedMessage>
                        <Button onClick={handleSignUpNavigation} tradId="signUp" defaultText="Sign Up" btnColor={"var(--btn-color2)"}/>
                    </div>
                    <div className={styles.forgotPassword}>
                        <Button onClick={handleForgotPasswordNavigation} tradId="forgotThePassword" defaultText="Forgot the password?" btnColor={"var(--btn-color2)"}/> 
                    </div>
                    <div className={styles.resendConfirmation}>
                      <Button onClick={handleResendEmail} tradId="resendEmail" defaultText="Resend Confirmation Email" btnColor={"var(--btn-color2)"}/> 
                    </div>
                </div>
            </div>
        </div>
    </>);
}
export default LoginModal;