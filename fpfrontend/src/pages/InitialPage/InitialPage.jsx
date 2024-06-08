import React, { useState, useEffect} from 'react';
import styles from './InitialPage.module.css';
import card1IMG from '../../assets/card1.jpg';
import card2IMG from '../../assets/card2.jpg';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Button from '../../components/buttons/landingPageBtn/Button';
import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useLabStore from '../../stores/useLabStore';
import { useNavigate } from 'react-router';
import bigLogo from '../../assets/verticalLogo2.png';


const InitialPage = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
  });
  const [videoError, setVideoError] = useState(false);

  const videoID = 'eYfTU8E0bgA'; // Your YouTube video ID
  const videoSrc = `https://www.youtube.com/embed/${videoID}?autoplay=1&mute=1&loop=1&playlist=${videoID}&controls=0&showinfo=0&rel=0&modestbranding=1`;
  const {laboratories, fetchLaboratories, loading, error} = useLabStore();
  const labs = [
    { id: 1, name: "Lab", city: "Lisboa", imageUrl: "https://cdn.jornaldenegocios.pt/images/2021-05/img_1200x1200$2021_05_17_12_30_27_403373.jpg" },
    { id: 2, name: "Lab", city: "Coimbra", imageUrl: "https://www.campeaoprovincias.pt/wp-content/uploads/2024/01/Critical-768x614-1.jpg" },
    { id: 3, name: "Lab", city: "Porto", imageUrl: "https://www.porto.pt/_next/image?url=https%3A%2F%2Fmedia.porto.pt%2Foriginal_images%2Fmno_critical_techworks.jpg&w=730&q=85" }
  ];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: true
  };

  useEffect(() => {
    fetchLaboratories();
  }, [fetchLaboratories]);

  const navigateWithFilter = (lab) => {
    navigate(`/homepage?laboratory=${lab.id}`);
  };

  
  return (
    <div className={styles.initialPage} >
      <div className={styles.content}>
        <div className={styles.welcomeBoard}>
          <img className={styles.bigLogo} src={bigLogo} alt="logo" />
          <div className={styles.buttons}>
            <Button path="/register" tradId="signUp" defaultText="Sign Up"/>
            <Button path="/homepage" tradId="enterTheApplication" defaultText="Enter The Application"/>
          </div>
        </div>
      </div>
      <div className={styles.appPresentation}>
        <div className={styles.cardContainer}>
          <div className={styles.card1}>
              {videoError ? (
                <img className={styles.card1IMG} src={card1IMG} alt="Fallback Image" />
              ) : (
                <iframe 
                  className={styles.card1Video}
                  src={videoSrc}
                  title="YouTube video player" 
                  frameBorder="0"
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
            <div className={styles.card3}>
            {laboratories.length > 0 ? (
      <Slider {...settings} className={styles.carouselContainer}>
        {laboratories.map(lab => (
          <div key={lab.id} className={styles.labCard}>
            <img className={styles.labImage} src={lab.imageUrl} alt={lab.name} />
            <h3>{lab.location}</h3>
            <Button onClick={() => navigateWithFilter(lab)} tradId="seeLabProjects" defaultText="See Lab Projects" btnColor={"var(--btn-color2)"}/>
          </div>
        ))}
      </Slider>
    ) : (
      <div>No Labs Found</div> 
    )}
            </div>
          </div>
       </div>
    </div>
  );
};

export default InitialPage;
