import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../../services/userService";
import { useEffect } from "react";
import ProfileForm from "../forms/profileForm/ProfileForm.jsx";
import styles from "./UserProfileBasicElements.module.css";

const UserProfileBasicElements = () => {
  const { nickname: profileNickname } = useParams();
  const [isOwnProfile, setIsOwnProfile] = useState();
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
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          const data = await userService.fetchUserInfo(profileNickname);
          console.log('data:', data);
          setUserProfileInfo(data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
    };

    fetchUserData();
  }, [profileNickname]);



    return(
        <div className={styles.profileContainer}>
        <section className={styles.userHeader}>
          <img src={userProfileInfo.photo} alt="User" className={styles.userPhoto} />
          <h2 className={styles.username}>{userProfileInfo.nickname}</h2>
        </section>
        <div className={styles.formsContainer}>
            <ProfileForm userProfileInfo={userProfileInfo} isOwnProfile={isOwnProfile}/>
        </div>
      </div>
    )
    };

export default UserProfileBasicElements;