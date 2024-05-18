import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InitialPage from './pages/InitialPage/InitialPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import languages from './translations';
import  useTranslationsStore  from './stores/useTranslationsStore';
import DialogModal from './components/dialogAlertError/dialogModal/DialogModal.jsx';
import DialogMultipleMessagesModal from './components/dialogAlertError/dialogModal/DialogMultipleMessagesModal.jsx';
import EmailConfirmationPage from './pages/EmailConfirmationPage/EmailConfirmationPage';
import HomePage from './pages/HomePage/HomePage';
import MainLayout from './pages/layout/MainLayout.jsx';
import AuthLayout from './pages/layout/AuthLayout.jsx';
import LoginModal from './components/modals/LoginModal.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage.jsx';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage.jsx';


function App() {
  const { locale } = useTranslationsStore();
  return (
    <>
      <IntlProvider locale={locale} messages={languages[locale]}>
        <DialogModal/>
        <DialogMultipleMessagesModal/>
        <Router>
          <LoginModal />
          <Routes>
              <Route path="/" element={<InitialPage />} />
              <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
              <Route path="/confirm" element={<EmailConfirmationPage />} />
              <Route path='/forgot-password' element={<AuthLayout><ForgotPasswordPage/></AuthLayout>}/>
              <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage/></AuthLayout>}/>
              <Route path="/homepage" element={<MainLayout><HomePage /></MainLayout>} />
              <Route path="/userprofile/:nickname" element={<MainLayout><UserProfilePage /></MainLayout>} />
          </Routes>
        </Router>
      </IntlProvider>
    </>
  );
}

export default App;
