import React, { useState , useEffect } from 'react';
import styles from './ProfileForm.module.css';
import { FormattedMessage} from 'react-intl';

const ProfileForm = ({ userProfileInfo }) => {

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
        >
          <option value="">Select visibility</option>
          <option value="true">Private</option>
          <option value="false">Public</option>
        </select>
      </div>
    </form>
  );
};

export default ProfileForm;
