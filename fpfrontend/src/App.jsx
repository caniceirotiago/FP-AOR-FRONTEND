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
import LoginModal from './components/modals/LoginModal.jsx';


function App() {
  const { locale } = useTranslationsStore();
  return (
    <>
      <IntlProvider locale={locale} messages={languages[locale]}>
        <DialogModal/>
        <DialogMultipleMessagesModal/>
        <LoginModal />
        <Router>
          <Routes>
              <Route path="/" element={<InitialPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/confirm" element={<EmailConfirmationPage />} />
              <Route path="/homepage" element={<MainLayout><HomePage /></MainLayout>} />
          </Routes>
        </Router>
      </IntlProvider>
    </>
  );
}

export default App;
