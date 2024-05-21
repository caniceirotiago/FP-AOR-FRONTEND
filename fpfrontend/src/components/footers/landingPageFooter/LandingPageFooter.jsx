import React from 'react';
import styles from './LandingPageFooter.module.css';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa6';

const LandingPageFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4>Contact Us</h4>
          <p><FaPhone /> +1 234 567 890</p>
          <p><FaEnvelope /> info@criticallab.com</p>
          <p><FaMapMarkerAlt /> 123 Lab Street, Science Park</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Follow Us</h4>
          <a href="https://www.facebook.com/criticalsoftware/" target="_blank" rel="noopener noreferrer"><FaFacebookF /> Facebook</a>
          <a href="https://x.com/i/flow/login?redirect_after_login=%2FCriticalSftware" target="_blank" rel="noopener noreferrer"><FaTwitter /> X</a>
          <a href="https://www.instagram.com/critical.software/" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
          <a href="https://www.linkedin.com/company/critical-software/" target="_blank" rel="noopener noreferrer"><FaLinkedin /> LinkedIn</a>
          <a href="https://www.youtube.com/user/criticalsoftware" target="_blank" rel="noopener noreferrer"><FaYoutube /> Youtube</a>


          

          
        </div>
      </div>
      <div className={styles.copyRight}>
        <p>© 2024 Critical Lab. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
