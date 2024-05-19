import React from 'react';
import styles from './UserProfilePage.module.css';
import UserProfileBasicElements from '../../components/UserProfilePageComponents/UserProfileBasicElements.jsx';   
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import userService from '../../services/userService';

const UserProfilePage = () => {
  const { nickname: profileNickname } = useParams();
  const [isOwnProfile, setIsOwnProfile] = useState();
  const [isAPrivateProfile, setIsAPrivateProfile] = useState();
  const [isTheProfileNotExistant, setIsTheProfileNotExistant] = useState();
  const [userProfileInfo, setUserProfileInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    photo: '',
    biography: '',
    laboratoryId: '',
    private: '',
  });

  useEffect(() => {
    const checkIfOwnProfile = () => {
      const loggedInNickname = localStorage.getItem('nickname');
      setIsOwnProfile(loggedInNickname === profileNickname);
    };

    checkIfOwnProfile();
  }, [userProfileInfo]);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          const response = await userService.fetchUserInfo(profileNickname);
          const data = await response.json();
          if(response.status === 401){
            setIsAPrivateProfile(true);
          }else if(response.status === 404){
            setIsTheProfileNotExistant(true);
          }else{
            setIsAPrivateProfile(false);
            setUserProfileInfo(data);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
    };

    fetchUserData();
  }, [profileNickname]);

  if(isAPrivateProfile){
    return (
      <div className={styles.userProfilePage} >
        <h1>Private Profile</h1>
      </div>
    );
  }
  if(isTheProfileNotExistant){
    return (
      <div className={styles.userProfilePage} >
        <h1>Profile Not Found</h1>
      </div>
    );
  }

  return (
    <div className={styles.userProfilePage} >
      <UserProfileBasicElements isOwnProfile={isOwnProfile} userProfileInfo={userProfileInfo}/>
    </div>
  );
};

export default UserProfilePage;
