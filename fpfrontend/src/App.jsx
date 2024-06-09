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
import ProjectPlanningPage from './pages/ProjectPlanningPage/ProjectPlanningPage.jsx';
import MessagesPage from './pages/MessagesPage/MessagesPage.jsx';
import ReportPage from './pages/ReportPage/ReportPage.jsx';
import InventoryPage from './pages/InventoryPage/InventoryPage.jsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.jsx';
import ProtectedRoute from './components/auth regist/ProtecterRoute.jsx';
import LandingPageLayout from './pages/layout/LandingPageLayout.jsx';
import ResendEmailPage from './pages/ResendEmailPage/ResendEmailPage.jsx';
import PublicMainLayout from './pages/layout/PublicMainLayout.jsx';
import ProjectPagePage from './pages/ProjectPage/ProjectPage.jsx';
import ProjectConfirmationPage from './pages/ProjectConfirmationPage/ProjectConfirmationPage.jsx';
import useThemeStore from './stores/useThemeStore.jsx';
import {useEffect} from 'react';
import useDeviceStore from './stores/useDeviceStore.jsx';
 

function App() {
  const { locale } = useTranslationsStore();
  const { theme } = useThemeStore();
  const { setDimensions, setDeviceType } = useDeviceStore();

  useEffect(() => {
    const handleResize = () => {
      setDimensions(window.innerWidth, window.innerHeight);
      setDeviceType(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call handleResize initially to set dimensions on mount

    return () => window.removeEventListener('resize', handleResize);
  }, [setDimensions, setDeviceType]);

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <>
      <IntlProvider locale={locale} messages={languages[locale]}>
        <DialogModal/>
        <DialogMultipleMessagesModal/>
        <Router>
          <LoginModal />
          <Routes>
              <Route path="/" element={<LandingPageLayout><InitialPage /></LandingPageLayout>} />
              <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
              <Route path="/confirm" element={<AuthLayout><EmailConfirmationPage /></AuthLayout>} />
              <Route path="/accept-project" element={<AuthLayout><ProjectConfirmationPage /></AuthLayout>} />
              <Route path="/confirm/project" element={<AuthLayout><ProjectConfirmationPage /></AuthLayout>} />
              <Route path='/request/newemail' element={<AuthLayout><ResendEmailPage/></AuthLayout>}/>
              <Route path='/forgot-password' element={<AuthLayout><ForgotPasswordPage/></AuthLayout>}/>
              <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage/></AuthLayout>}/>
              <Route path="/homepage" element={<PublicMainLayout><HomePage isAuthenticated={false}/></PublicMainLayout>} />
              <Route path="/authenticatedhomepage" element={<ProtectedRoute><MainLayout><HomePage isAuthenticated={true}/></MainLayout></ProtectedRoute>} />
              <Route path="/projectplanning" element={<ProtectedRoute><MainLayout><ProjectPlanningPage /></MainLayout></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><MainLayout><MessagesPage /></MainLayout></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><MainLayout><ReportPage /></MainLayout></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><MainLayout><InventoryPage /></MainLayout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
              <Route path="/userprofile/:username" element={<ProtectedRoute><MainLayout><UserProfilePage /></MainLayout></ProtectedRoute>} />
              <Route path="/projectpage/:id" element={<ProtectedRoute><MainLayout><ProjectPagePage /></MainLayout></ProtectedRoute>} />

          </Routes>
        </Router>
      </IntlProvider>
    </>
  );
}

export default App;
