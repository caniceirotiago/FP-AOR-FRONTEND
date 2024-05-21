import React, { useState} from 'react';
import styles from './InitialPage.module.css';
import card1IMG from '../../assets/card1.jpg';
import card2IMG from '../../assets/card2.jpg';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import RippleButton from '../../components/buttons/landingPageBtn/Button';
import { useInView } from 'react-intersection-observer';



const InitialPage = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });
  const [videoError, setVideoError] = useState(false);

  const videoID = 'eYfTU8E0bgA'; // Your YouTube video ID
  const videoSrc = `https://www.youtube.com/embed/${videoID}?autoplay=1&mute=1&loop=1&playlist=${videoID}&controls=0&showinfo=0&rel=0&modestbranding=1`;

  return (
    <div className={styles.initialPage} >
      <div className={styles.content}>
        <div className={styles.welcomeBoard}>
          <h1 className={styles.title}><FormattedMessage id="welcomeToCriticalLab">Welcome to Critical Lab!</FormattedMessage></h1>
          <p className={styles.subtitle}><FormattedMessage id="exploreInnovateMoveForward">Explore. Inove. Avance.</FormattedMessage></p>
          <div className={styles.buttons}>
            <RippleButton path="/register" tradId="signUp" defaultText="Sign Up"/>
            <RippleButton path="/homepage" tradId="enterTheApplication" defaultText="Enter The Application"/>
          </div>
        </div>

        

      </div>
      <div className={styles.appPresentation}>
      <div className={styles.card1}>
          {videoError ? (
            <img className={styles.card1IMG} src={card1IMG} alt="Fallback Image" />
          ) : (
            <iframe 
              className={styles.card1Video}
              src={videoSrc}
              title="YouTube video player" 
              frameborder="0"
              onError={() => setVideoError(true)} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            ></iframe>
          )}
        </div>
         
        <div ref={ref} className={`${styles.card2} ${inView ? styles.slideIn : ''}`}>
          <div className={styles.card2ImageSection}>
            <img className={styles.card2IMG} src={card2IMG} alt="Description of the app" />
          </div>
          <div className={styles.card2TextSection}>
            <h3><FormattedMessage id="appDescription" defaultMessage="Innovation Lab Management System" /></h3>
            <p><FormattedMessage id="appDetails" defaultMessage="Our application facilitates the creation, management, and tracking of innovative projects in a collaborative environment. Features include user profiles, project management, resource allocation, and secure communication channels." /></p>
          </div>
        </div>

       
       </div>

    </div>
  );
};

export default InitialPage;
