import React, { useEffect } from "react";
import { useState } from "react";
import ProfileForm from "../forms/profileForm/ProfileForm.jsx";
import styles from "./UserProfileBasicElements.module.css";
import PasswordForm from "../auth regist/changePasswordForm/PasswordForm.jsx";
import { FormattedMessage } from "react-intl";
import Button from '../buttons/landingPageBtn/Button.jsx'
import userService from "../../services/userService";
import { useNavigate } from "react-router-dom";
import  useComposeEmailModal  from "../../stores/useComposeEmailModal.jsx";
import { FaEdit } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { stateColorsBriefcaseBackground } from "../../utils/colors/projectColors";



const UserProfileBasicElements = ({ fetchPrivateProfileDataByUsername, usernameProfile, isOwnProfile, userProfileInfo, fetchUserData, isEditing, setIsEditing, isPrivate}) => {
  const navigate = useNavigate();
  const { setSelectedUser, setComposeModalOpen } = useComposeEmailModal();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const handleEditModeTrue = (e) => {
    setIsEditing(true);
  }
  const handleEditModeFalse = (e) => {
    setShowPasswordForm(false);
    setIsEditing(false);
  }
  const handleChatRedirect = () => {
    navigate(`/messages`);
    setSelectedUser({id: userProfileInfo.id, username: userProfileInfo.username});
    setComposeModalOpen(true);
  };

  useEffect(() => {
    if (isPrivate && !isOwnProfile) {
      fetchPrivateProfileDataByUsername();
    }
  }, [isPrivate]);

    return(
        <div className={styles.profileContainer}>
          <div className={styles.innerHead}
          style={{
            backgroundImage:
              stateColorsBriefcaseBackground["PLANNING"],
          }}>
        <section className={styles.userHeader}>
          
          <img src={userProfileInfo?.photo} alt="User" className={styles.userPhoto} />
          <h2 className={styles.username}>{userProfileInfo?.username}</h2>
          <div className={styles.profileBtns}>
          {!isEditing && isOwnProfile && (
            <button className={styles.iconButton} onClick={handleEditModeTrue}>
              <FaEdit className={styles.svgIcon} />
              <span className={styles.btnText}>
                <FormattedMessage id="editBtnProfForm" defaultMessage="Edit" />
              </span>
            </button>
          )}
          {isEditing && isOwnProfile && (
            <>
              <button className={styles.iconButton} onClick={handleEditModeFalse}>
                <FaSignOutAlt className={styles.svgIcon} />
                <span className={styles.btnText}>
                  <FormattedMessage id="editBtnProfFormFalse" defaultMessage="Exit Edit" />
                </span>
              </button>
              <button
                className={styles.iconButton}
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                <FaKey className={styles.svgIcon} />
                <span className={styles.btnText}>
                  <FormattedMessage
                    id={showPasswordForm ? "editProfileInformation" : "changePassword"}
                    defaultMessage={showPasswordForm ? "Edit Profile Information" : "Change Password"}
                  />
                </span>
              </button>
            </>
          )}
          {!isOwnProfile && (
            <button className={styles.iconButton} onClick={handleChatRedirect}>
              <FaEnvelope className={styles.svgIcon} />
              <span className={styles.btnText}>
                <FormattedMessage id="sendMessage" defaultMessage="Send Message" />
              </span>
            </button>
          )}
        </div>
        </section>
        </div>
        {((isOwnProfile) || (!isPrivate && !isOwnProfile)) && 
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
        }
      </div>
    )
    };

export default UserProfileBasicElements;