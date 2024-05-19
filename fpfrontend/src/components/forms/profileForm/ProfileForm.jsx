import React, { useState , useEffect } from 'react';
import styles from './ProfileForm.module.css';
import { FormattedMessage} from 'react-intl';
import userService from '../../../services/userService';

const ProfileForm = ({ userProfileInfo, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false); 


  const [profile, setProfile] = useState({
    email: '',
    firstName: '',
    lastName: '',
    biography: '',
    laboratoryId: '',
    private: '',
    });

  useEffect(() => {
    setProfile({ ...userProfileInfo });
    console.log('userProfileInfo:', userProfileInfo);
  }, [userProfileInfo]); 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUserProfile = async (profile) => {
    try {
      const { email, ...profileData } = profile;
      const result = await userService.updateUser(profileData);
      if(result.status === 204){
        //notify('Profile updated successfully');
        //onUpdateSuccess(); to fetch again the user profile
      }
      else console.log("Failed to update profile")//notify('Failed to update profile. Please try again.');
    } catch (error) {
      console.error("Failed to update user profile:", error);
      console.log("Failed to update profile") //notify('Failed to update profile. Please try again.');
    }
  };  

  
  return (
    <form className={styles.formProfile}>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="email"><FormattedMessage id="email">Email</FormattedMessage></label>
        <input
          className={styles.input}
          type="email"
          id="email"
          name="email"
          value={profile.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          disabled={true}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="firstName"><FormattedMessage id="firstName">First Name</FormattedMessage></label>
        <input
          className={styles.input}
          type="text"
          id="firstName"
          name="firstName"
          value={profile.firstName}
          onChange={handleInputChange}
          placeholder="Enter your first name"
          disabled={!isEditing}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="lastName"><FormattedMessage id="lastName">Last Name</FormattedMessage></label>
        <input
          className={styles.input}
          type="text"
          id="lastName"
          name="lastName"
          value={profile.lastName}
          onChange={handleInputChange}
          placeholder="Enter your last name"
          disabled={!isEditing}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="biography">
          <FormattedMessage id="biography">Biography</FormattedMessage>
        </label>
        <textarea
          className={styles.input}
          id="biography"
          name="biography"
          value={profile.biography}
          onChange={handleInputChange}
          placeholder="Enter your biography"
          disabled={!isEditing}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="laboratoryId">
          <FormattedMessage id="laboratoryId">Laboratory ID</FormattedMessage>
        </label>
        <input
          className={styles.input}
          type="text"
          id="laboratoryId"
          name="laboratoryId"
          value={profile.laboratoryId}
          onChange={handleInputChange}
          placeholder="Enter your laboratory ID"
          disabled={!isEditing}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="private">
          <FormattedMessage id="private">Private</FormattedMessage>
        </label>
        <select
          className={styles.input}
          id="private"
          name="private"
          value={profile.private}
          onChange={handleInputChange}
          disabled={!isEditing}
        >
          <option value="">Select visibility</option>
          <option value="true">Private</option>
          <option value="false">Public</option>
        </select>
      </div>

      {isEditing ? (
          <FormattedMessage id="saveChangesUserProfForm">{(value) => (<input className={styles.input} type="submit" value={"Save Changes"} />)}</FormattedMessage>
        ) : (
          isOwnProfile && (
            <button type="button" onClick={() => setIsEditing(true)} className={styles.editButton} >
            <FormattedMessage id="editBtnProfForm">Edit</FormattedMessage>
          </button>
          )
        )}

    </form>
  );
};

export default ProfileForm;
