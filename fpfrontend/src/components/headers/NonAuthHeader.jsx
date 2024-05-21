import React, {useEffect, useState, useRef} from 'react';
import useThemeStore from '../../stores/useThemeStore.jsx';
import styles from './NonAuthHeader.module.css'; 
import useTranslationStore from '../../stores/useTranslationsStore';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import logo from '../../assets/CriticalLogo.png';
import { FaGlobeEurope } from 'react-icons/fa';


const NonAuthHeader = () => {
  const { theme, toggleTheme } = useThemeStore();
  const locale = useTranslationStore((state) => state.locale);
  const handleSelectLanguage = (event) => {
    const newLocale = event.target.value;
    updateLocale(newLocale);
  };
  const updateLocale = useTranslationStore((state) => state.updateLocale);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };
  return (
    <header className={styles.header}>
      <img className={styles.logo} src={logo} alt="Logo" />
      <div className={styles.rightAligned}>
      <div className={styles.rightAligned}>
        <div className={styles.languageSelection} onClick={toggleLanguageDropdown}>
          <FaGlobeEurope size={24} title="Change Language" />
          {isLanguageDropdownOpen && (
            <div className={styles.dropdownContent}>
              <div className={styles.dropdownItem} onClick={() => updateLocale('en')}>English</div>
              <div className={styles.dropdownItem} onClick={() => updateLocale('pt')}>Português</div>
            </div>
          )}
        </div>
      </div>
      </div>
    </header>
  );
};

export default NonAuthHeader;
