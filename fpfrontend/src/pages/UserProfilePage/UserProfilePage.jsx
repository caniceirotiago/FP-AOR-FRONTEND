import React from 'react';
import styles from './UserProfilePage.module.css';
import UserProfileBasicElements from '../../components/UserProfilePageComponents/UserProfileBasicElements.jsx';   
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import userService from '../../services/userService';
import AttributeEditor from '../../components/reactSelect/AttributeEditor.jsx';

const UserProfilePage = () => {
  const { username: usernameProfile } = useParams();
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
      const loggedInUsername = localStorage.getItem('username');
      setIsOwnProfile(loggedInUsername === usernameProfile);
    };

    checkIfOwnProfile();
  }, [userProfileInfo, usernameProfile]);

  const fetchUserData = async () => {
        try {
          const response = await userService.fetchUserInfo(usernameProfile);
          const data = await response.json();
          if(response.status === 401){
            setIsAPrivateProfile(true);
          }else if(response.status === 404){
            setIsTheProfileNotExistant(true);
          }else{
            setIsAPrivateProfile(false);
            setIsTheProfileNotExistant(false);
            setUserProfileInfo(data);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
    };
  useEffect(() => {
    fetchUserData();
  }, [usernameProfile]);



  return (
    <>
    {isAPrivateProfile ? (
      <div className={styles.userProfilePage} >
        <h1>Private Profile</h1>
      </div>
    ) : isTheProfileNotExistant ? (
      <div className={styles.userProfilePage} >
        <h1>Profile Not Found</h1>
      </div>
    ) : (
      <div className={styles.userProfilePage} >
        <UserProfileBasicElements fetchUserData={fetchUserData} isOwnProfile={isOwnProfile} userProfileInfo={userProfileInfo}/>
        <div className={styles.otherAtributes}>
          <AttributeEditor title="skills" editMode={true}/>
          <AttributeEditor title="interests" editMode={isOwnProfile}/>
        </div>
      </div>
      
    )}
      </>
  );

};

export default UserProfilePage;
