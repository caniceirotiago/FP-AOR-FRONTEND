import React from 'react';
import styles from './UserProfilePage.module.css';
import UserProfileBasicElements from '../../components/UserProfilePageComponents/UserProfileBasicElements.jsx';   
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import userService from '../../services/userService';
import AttributeEditor from '../../components/reactSelect/AttributeEditor.jsx';

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false); 
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
          if(response.status === 403){
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
        <UserProfileBasicElements fetchUserData={fetchUserData} isOwnProfile={isOwnProfile} userProfileInfo={userProfileInfo} isEditing={isEditing} setIsEditing={setIsEditing}/>
        <div className={styles.otherAtributes}>
          <AttributeEditor title="skills" mainEntity= "user" editMode={isOwnProfile && isEditing} creationMode={false} username={usernameProfile}/>
          <AttributeEditor title="interests" mainEntity= "user" editMode={isOwnProfile && isEditing} creationMode={false} username={usernameProfile}/>
        </div>
      </div>
      
    )}
      </>
  );

};

export default UserProfilePage;
