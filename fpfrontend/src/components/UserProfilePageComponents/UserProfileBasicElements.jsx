import React from "react";
import { useState } from "react";
import ProfileForm from "../forms/profileForm/ProfileForm.jsx";
import styles from "./UserProfileBasicElements.module.css";
import PasswordForm from "../auth regist/changePasswordForm/PasswordForm.jsx";
import { FormattedMessage } from "react-intl";
import Button from '../buttons/landingPageBtn/Button.jsx'


const UserProfileBasicElements = ({isOwnProfile, userProfileInfo, fetchUserData, isEditing, setIsEditing}) => {

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const handleEditModeTrue = (e) => {
    setIsEditing(true);
  }
  const handleEditModeFalse = (e) => {
    setShowPasswordForm(false);
    setIsEditing(false);
  }

    return(
        <div className={styles.profileContainer}>
        <section className={styles.userHeader}>
          <img src={userProfileInfo.photo} alt="User" className={styles.userPhoto} />
          <h2 className={styles.username}>{userProfileInfo.username}</h2>
          {(!isEditing && isOwnProfile) && <Button className={styles.button} type="button" onClick={(event) => handleEditModeTrue(event)} tradId="editBtnProfForm" defaultText="Edit" btnColor={"var(--btn-color2)"}/> }
          {(isEditing && isOwnProfile) && <Button className={styles.button} type="button" onClick={(event) => handleEditModeFalse(event)} tradId="editBtnProfFormFalse" defaultText="Exit Edit Mode" btnColor={"var(--btn-color2)"}/> }
          {(isEditing && isOwnProfile) && <Button className={styles.toggleFormButton} onClick={() => setShowPasswordForm(!showPasswordForm)} tradId={showPasswordForm ? "editProfileInformation" :  "changePassword"} defaultText={showPasswordForm ? "Edit Profile Information" :  "Change Password"} btnColor={"var(--btn-color2)"}/>} 

        </section>
        <div className={styles.formsContainer}>
          {isOwnProfile ? (
          <>
            {!showPasswordForm ? (
              <ProfileForm userProfileInfo={userProfileInfo} isOwnProfile={isOwnProfile} fetchUserData={fetchUserData} isEditing={isEditing} setIsEditing={setIsEditing} />
            ) : (
              <PasswordForm />
            )}
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