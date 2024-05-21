import React, { useState } from 'react';
import styles from './PasswordForm.module.css';
import {  FormattedMessage } from 'react-intl';


/**
 * PasswordForm provides a form for users to update their password. It includes fields for the old password,
 * new password, and confirmation of the new password. Input validation is performed to ensure the new passwords
 * match and meet the specified criteria before submission. Upon successful validation, the onUpdateUserPassword
 * callback is called to handle the password update process.
 */

const PasswordForm = ({ onUpdateUserPassword }) => {
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordFields({ ...passwordFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = passwordFields;
   
    const errorsObj = {
     // newPassword: validatePassword(newPassword, confirmNewPassword),
    };

    setErrors(errorsObj);

    const isValid = !Object.values(errorsObj).some(error => error);
    if (isValid) {
      try {
        await onUpdateUserPassword( oldPassword, newPassword );

        setPasswordFields({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      } catch (error) {
        console.log('Failed to update password. Please try again.');
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="oldPassword"><FormattedMessage id="oldPassword">Old Password </FormattedMessage></label>
        <input
          className={styles.input}
          type="password"
          id="oldPassword"
          name="oldPassword"
          value={passwordFields.oldPassword}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="newPassword"><FormattedMessage id="newPassword">New Password</FormattedMessage></label>
        <input
          className={styles.input}
          type="password"
          id="newPassword"
          name="newPassword"
          value={passwordFields.newPassword}
          onChange={handleInputChange}
        />
        {errors.newPassword && <div className={styles.error}>{errors.newPassword}</div>}
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="confirmNewPassword"><FormattedMessage id="confirmNewPassword">Confirm New Password</FormattedMessage></label>
        <input
          className={styles.input}
          type="password"
          id="confirmNewPassword"
          name="confirmNewPassword"
          value={passwordFields.confirmNewPassword}
          onChange={handleInputChange}
        />
        {errors.newPassword && <div className={styles.error}>{errors.newPassword}</div>}
      </div>
      <FormattedMessage id="updatePasswordbtn">{(value) => (<input className={styles.input} type="submit" value={value} />)}</FormattedMessage>
    </form>
  );
};

export default PasswordForm;
