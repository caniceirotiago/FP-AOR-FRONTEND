import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../../services/userService";
import { useEffect } from "react";
import ProfileForm from "../forms/profileForm/ProfileForm.jsx";
import styles from "./UserProfileBasicElements.module.css";

const UserProfileBasicElements = ({isOwnProfile, userProfileInfo}) => {


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