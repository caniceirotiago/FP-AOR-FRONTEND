import React from 'react';
import styles from './LandingPageFooter.module.css';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa6';
import { FormattedMessage } from 'react-intl';

const LandingPageFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4><FormattedMessage id="contactUs">Contact Us</FormattedMessage></h4>
          <p><FaPhone /> +351 999 999 999</p>
          <p><FaEnvelope /> info@criticallab.com</p>
          <p><FaMapMarkerAlt /> Pólo II da Universidade de Coimbra, R. Silvio Lima, 3030-790 Coimbra</p>
        </div>
        <div className={styles.footerSection}>
          <h4><FormattedMessage id="followUs">Follow Us</FormattedMessage></h4>
          <a href="https://www.facebook.com/criticalsoftware/" target="_blank" rel="noopener noreferrer"><FaFacebookF /> Facebook</a>
          <a href="https://x.com/i/flow/login?redirect_after_login=%2FCriticalSftware" target="_blank" rel="noopener noreferrer"><FaTwitter /> X</a>
          <a href="https://www.instagram.com/critical.software/" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
          <a href="https://www.linkedin.com/company/critical-software/" target="_blank" rel="noopener noreferrer"><FaLinkedin /> LinkedIn</a>
          <a href="https://www.youtube.com/user/criticalsoftware" target="_blank" rel="noopener noreferrer"><FaYoutube /> Youtube</a>


          

          
        </div>
      </div>
      <div className={styles.copyRight}>
        <p>© {new Date().getFullYear()} Critical Lab</p>
        <p>Tiago Caniceiro & Vasco Castro</p>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
