import React, {useEffect, useState, useRef} from 'react';
import useThemeStore from '../../stores/useThemeStore.jsx';
import styles from './NonAuthHeader.module.css'; 
import useTranslationStore from '../../stores/useTranslationsStore';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import logo from '../../assets/CriticalLogo.png';


const NonAuthHeader = () => {
  const { theme, toggleTheme } = useThemeStore();
  const locale = useTranslationStore((state) => state.locale);
  const handleSelectLanguage = (event) => {
    const newLocale = event.target.value;
    updateLocale(newLocale);
  };
  const updateLocale = useTranslationStore((state) => state.updateLocale);


  return (
    <header className={styles.header}>
      <img className={styles.logo} src={logo} alt="Logo" />
      <div className={styles.rightAligned}>
            <div className={styles.languageSelection}>
              <select className={styles.languageSelector} onChange={handleSelectLanguage} defaultValue={locale}>
                {["en", "pt"].map(language => (<option
                key={language}>{language}</option>))}
              </select>
              {locale === "pt" && <span className={styles.flag} class="fi fi-pt"></span> }
              {locale === "en" && <span className={styles.flag} class="fi fi-gb"></span> }
            </div>
      </div>
    </header>
  );
};

export default NonAuthHeader;
