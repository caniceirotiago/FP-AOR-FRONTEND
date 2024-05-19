import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../../services/userService";
import { useEffect } from "react";
import ProfileForm from "../forms/profileForm/ProfileForm.jsx";
import styles from "./UserProfileBasicElements.module.css";
import PasswordForm from "../auth regist/changePasswordForm/PasswordForm.jsx";
import { FormattedMessage } from "react-intl";

const UserProfileBasicElements = ({isOwnProfile, userProfileInfo}) => {

  const [showPasswordForm, setShowPasswordForm] = useState(false);

    return(
        <div className={styles.profileContainer}>
        <section className={styles.userHeader}>
          <img src={userProfileInfo.photo} alt="User" className={styles.userPhoto} />
          <h2 className={styles.username}>{userProfileInfo.nickname}</h2>
        </section>
        <div className={styles.formsContainer}>
          {isOwnProfile ? (
          <>
            {!showPasswordForm ? (
              <ProfileForm userProfileInfo={userProfileInfo} isOwnProfile={isOwnProfile} />
            ) : (
              <PasswordForm />
            )}
            <button onClick={() => setShowPasswordForm(!showPasswordForm)} className={styles.toggleFormButton}>
              {showPasswordForm ? <FormattedMessage id="editProfileInformation">Edit Profile Information</FormattedMessage> : <FormattedMessage id="changePassword">Change Password</FormattedMessage>}
            </button>
          </>
          ) : (<>
            <ProfileForm userProfileInfo={userProfileInfo} readOnly={true} isOwnProfile={isOwnProfile}/>
            </>
          )}
        </div>
      </div>
    )
    };

export default UserProfileBasicElements;