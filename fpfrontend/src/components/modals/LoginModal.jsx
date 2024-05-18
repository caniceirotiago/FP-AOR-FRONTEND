import React, {useState} from 'react'
import useLoginModalStore from '../../stores/useLoginModalStore.jsx'
import styles from './LoginModal.module.css'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import userService from '../../services/userService'
import useAuthStore from '../../stores/useAuthStore.jsx'


const LoginModal = () => {
    const {isLoginModalOpen, setIsLoginModalOpen} = useLoginModalStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {login} = useAuthStore();


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await userService.login(email, password);
            if(response.status === 200){
                handleSussefulLogin();
            } else {
                console.error('Login failed:', response);
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
    const handleSussefulLogin = async () => {
        const response = await userService.fetchUserBasicInfo();
        const data = await response.json();
        if(data){
            sessionStorage.setItem('photo', data.photo);
            sessionStorage.setItem('nickname', data.nickname);
            sessionStorage.setItem('role', data.role);
            setIsLoginModalOpen(false); 
            login();
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
    const handleOnClose = (event) => {
        setIsLoginModalOpen(false);
    }

    if(!isLoginModalOpen) return null;
    return(<>
        <div className={styles.mainContentModal} >
            <div className={styles.modal}>
                <form id="loginForm" onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.banner}>
                        <p className={styles.memberLoginBanner}><FormattedMessage id="memberLogin">Member Login</FormattedMessage></p>
                        <button  type="button" onClick={handleOnClose} className={styles.closeButton}>X</button>
                    </div>
                    <div className={styles.content}>
                        <label htmlFor="email" className={styles.label}><FormattedMessage id="email">Email</FormattedMessage></label>
                        <input className={styles.input} type="email" name="email" id="email" maxLength="100" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="password" className={styles.label}><FormattedMessage id="password">Password</FormattedMessage></label>
                        <input className={styles.input} type="password" name="password" id="password" maxLength="25" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <input className={styles.submit} type="submit" id="login" value="Login" />
                    </div>
                </form>
                <div className={styles.otherOptions}>
                    <div className={styles.signup}><FormattedMessage id="dontHaveAnAccount">Don't have an account?</FormattedMessage><button onClick={handleSignUpNavigation}><FormattedMessage id="signUp">Sign up</FormattedMessage></button></div>
                    <div className={styles.forgotPassword}><button onClick={handleForgotPasswordNavigation}><FormattedMessage id="forgotThePassword">Forgot the password?</FormattedMessage></button></div>
                    <div className={styles.resendConfirmation}>
                        <FormattedMessage id="didntReceiveConfirmationEmail">
                            <span>Didn't receive the confirmation email? </span>
                        </FormattedMessage>
                        {/* <Link to="/resend-email">
                            <FormattedMessage id="resendEmail">Resend Email</FormattedMessage>
                        </Link> */}
                    </div>
                </div>
            </div>
        </div>
    </>);
}
export default LoginModal;