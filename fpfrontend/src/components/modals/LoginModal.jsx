import React, {useState} from 'react'
import useLoginModalStore from '../../stores/useLoginModalStore.jsx'
import styles from './LoginModal.module.css'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'


const LoginModal = () => {
    const {isLoginModalOpen, setIsLoginModalOpen} = useLoginModalStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleLogin = (event) => {

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
                        <button  onClick={handleOnClose} className={styles.closeButton}>X</button>
                    </div>
                    <div className={styles.content}>
                        <label htmlFor="username" className={styles.label}><FormattedMessage id="username">Username</FormattedMessage></label>
                        <input className={styles.input} type="text" name="username" id="username" maxLength="25" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
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