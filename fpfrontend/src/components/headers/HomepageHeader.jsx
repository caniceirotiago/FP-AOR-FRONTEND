import React, {useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../../stores/useThemeStore.jsx';
import styles from './HomepageHeader.module.css'; 
import { useLocation } from 'react-router-dom';
import { FaBars, FaMoon, FaSun, FaSignOutAlt, FaBell, FaSignInAlt } from 'react-icons/fa';
import useTranslationStore from '../../stores/useTranslationsStore';
import { FormattedMessage } from "react-intl";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import useLoginModalStore from '../../stores/useLoginModalStore.jsx'
import useAuthStore from '../../stores/useAuthStore.jsx'
import { Link } from 'react-router-dom';
import logo from '../../assets/CriticalLogo.png';
import logo2 from '../../assets/CriticalLogo2.png';
import userService from '../../services/userService.jsx';
import {notificationService} from '../../services/notificationService.jsx';
import notificationStore from '../../stores/useNotificationStore.jsx';
import ProtectedComponents from '../auth regist/ProtectedComponents.jsx';
import  useComposeEmailModal  from '../../stores/useComposeEmailModal.jsx';





const HomepageHeader = () => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationListOpen, setIsNotificationListOpen] = useState(false);
  const navMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const navToggleButtonRef = useRef(null);
  const notificationToggleButtonRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { isLoginModalOpen , setIsLoginModalOpen} = useLoginModalStore();
  const { logout, isAuthenticated } = useAuthStore();
  const {setSelectedUser, setComposeModalOpen} = useComposeEmailModal();



  const { notification, setNotification } = notificationStore();
  const totalNotifications = notification.length;

  //const { openChatModal } = useChatModalStore();
  const locale = useTranslationStore((state) => state.locale);
  const handleSelectLanguage = (event) => {
    const newLocale = event.target.value;
    updateLocale(newLocale);
  };
  const updateLocale = useTranslationStore((state) => state.updateLocale);



  const fetchNotifications = async () => {
   const notifications = await notificationService.getUserNotifications();

   setNotification(notifications);

  }

  useEffect(() => {
     if(isAuthenticated)fetchNotifications();
  }, []);


  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target) &&
        !navToggleButtonRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target) &&
          !notificationToggleButtonRef.current.contains(event.target) && isNotificationListOpen) {
          setIsNotificationListOpen(false);
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
        document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [isMenuOpen, isNotificationListOpen]); 

  const renderNotifications = () => {
    const entries = [];
    console.log(notification);
    
    notification.forEach((notifs) => {

        const mostRecentNotificationHourDate = notifs.length > 0 ? notifs[notifs.length - 1].sentAt : null;
        entries.push(
            <div key={notifs.id} className={styles.notificationItem} onClick={() => handleNotificationClick(notifs)}>
              
               {notifs.content}
            </div>
        );
    });
    if(entries.length === 0) {
        entries.push(
              <div key="no-notifications" className={styles.notificationItem}>
                <FormattedMessage id="noNewNotifications">No new notifications</FormattedMessage>
              </div>
        );
    }
      return entries;
  };
 const markMessageNotificationsAsRead = async (notifId) => {
    await notificationService.markNotificationsAsRead(notifId);
    fetchNotifications();
  };
  const username = localStorage.getItem("username");
  const photo = localStorage.getItem("photo") ; 

  const handleNotificationClick = (notifs) => {
    console.log(notifs);

    switch(notifs.type) {
      case 'INDIVIDUAL_MESSAGE':
        navigate(`/messages`);
        setSelectedUser({id: notifs.individualMessage.sender.id, username: notifs.individualMessage.sender.username});
        setComposeModalOpen(true);
        markMessageNotificationsAsRead(notifs.id);
        break;
      case 'PROJECT_JOIN_REQUEST':
        navigate(`/projectpage/${notifs.projectId}`);
        markMessageNotificationsAsRead(notifs.id);
        break;
      case 'PROJECT_APPROVAL':
        navigate(`/projectpage/${notifs.projectId}`);
        markMessageNotificationsAsRead(notifs.id);
      case 'TASK_RESPONSIBLE':
        markMessageNotificationsAsRead(notifs.id);
      case 'TASK_EXECUTER':
        markMessageNotificationsAsRead(notifs.id);

      default:
        break;
    }

    setIsNotificationListOpen(false);
  };

  const handleToggleNavMenu = (event) => {
    event.stopPropagation(); 
    setIsMenuOpen(!isMenuOpen);
  };

  const handleToggleNotificationMenu = (event) => {
    event.stopPropagation(); 
    setIsNotificationListOpen(!isNotificationListOpen);
  };
  const handleOpenLoginModal = (event) => {
    setIsLoginModalOpen(true);
  }
  const handleLogout = async (event) => {
    const response = await userService.logout();
    logout(); 
    navigate('/homepage');
  }
  const handleHomepageNavigate = () => {
    if(!isAuthenticated)navigate('/homepage');
    else navigate(`/authenticatedHomepage`);

  }

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer} onClick={handleHomepageNavigate}>
        {theme === "light" ? <img src={logo} alt="Logo" className={styles.logo} /> : <img src={logo2} alt="Logo" className={styles.logo} />}
      </div>
      
      <div className={styles.rightAligned}>
        {isAuthenticated ? (
          <>
          <div className={styles.usernameDisplay} onClick={() => navigate(`/userProfile/${username}`)}>
            {username}
          </div>
          <div className={styles.userPhoto} >
            <img src={photo} alt="User" className={styles.userImage} onClick={() => navigate(`/userProfile/${username}`)}/>
          </div>
          </>) : 
        null}
        <div className={styles.notificationSection}>
          <div  ref={notificationToggleButtonRef} className={styles.notificationBell} onClick = {handleToggleNotificationMenu}>
            {isAuthenticated && <FaBell />}
            {totalNotifications === 0 ? null : <div className={styles.notificationNumber}>{totalNotifications}</div>}

          </div>
          {isNotificationListOpen && (
            <div  ref={notificationMenuRef} className={styles.dropdownContent}>
              {renderNotifications()}
            </div>
          )}
        </div>
        {!isAuthenticated && 
        <div onClick={handleOpenLoginModal} className={styles.accessBtn}>
              <FaSignInAlt /> <FormattedMessage id="access">Access</FormattedMessage>
        </div>
        }
        <div  ref={navToggleButtonRef} className={styles.menuBurger} onClick={handleToggleNavMenu}>
          <FaBars />
        </div>
        {isMenuOpen && (
          <div  ref={navMenuRef} className={styles.dropdownContent}>
            
            <div onClick={toggleTheme}>
              {theme === 'dark' ? <FaSun /> : <FaMoon />} {theme === 'dark' ? <FormattedMessage id="lightMode">Light Mode</FormattedMessage> : <FormattedMessage id="darkMode">Dark Mode</FormattedMessage>}
            </div>
            <div className={styles.languageSelection}>
              <select className={styles.languageSelector} onChange={handleSelectLanguage} defaultValue={locale}>
                {["en", "pt"].map(language => (<option
                key={language}>{language}</option>))}
              </select>
              {locale === "pt" && <span className={`${styles.flag} fi fi-pt`}></span>}
              {locale === "en" && <span className={`${styles.flag} fi fi-gb`}></span>}
            </div>
            {isAuthenticated ? (
            <div onClick={handleLogout}>
              <FaSignOutAlt /> <FormattedMessage id="logout">Logout</FormattedMessage>
            </div>)
            :
            null
            }         
          </div>
        )}
      </div>
    </header>
  );
};

export default HomepageHeader;
