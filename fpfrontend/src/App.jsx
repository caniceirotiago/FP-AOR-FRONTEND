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
              <Route path="/" element={<LandingPageLayout><InitialPage /></LandingPageLayout>} />
              <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
              <Route path="/confirm" element={<EmailConfirmationPage />} />
              <Route path='/forgot-password' element={<AuthLayout><ForgotPasswordPage/></AuthLayout>}/>
              <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage/></AuthLayout>}/>
              <Route path="/homepage" element={<MainLayout><HomePage /></MainLayout>} />
              <Route path="/authenticatedhomepage" element={<ProtectedRoute><MainLayout><HomePage /></MainLayout></ProtectedRoute>} />
              <Route path="/projectplanning" element={<ProtectedRoute><MainLayout><ProjectPlanningPage /></MainLayout></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><MainLayout><MessagesPage /></MainLayout></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><MainLayout><ReportPage /></MainLayout></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><MainLayout><InventoryPage /></MainLayout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
              <Route path="/userprofile/:username" element={<ProtectedRoute><MainLayout><UserProfilePage /></MainLayout></ProtectedRoute>} />
          </Routes>
        </Router>
      </IntlProvider>
    </>
  );
}

export default App;
