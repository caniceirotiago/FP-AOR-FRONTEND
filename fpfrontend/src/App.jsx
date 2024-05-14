import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InitialPage from './pages/InitialPage/InitialPage';
import languages from './translations';
import  useTranslationsStore  from './stores/useTranslationsStore';


function App() {
  const { locale } = useTranslationsStore();
  return (
    <>
      <IntlProvider locale={locale} messages={languages[locale]}>
        <Router>
          <Routes>
              <Route path="/" element={<InitialPage />} />
          </Routes>
        </Router>
    </IntlProvider>
  </>
  );
}

export default App;
