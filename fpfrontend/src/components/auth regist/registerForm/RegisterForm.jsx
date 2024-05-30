import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.css';
import {FormattedMessage} from 'react-intl';
import userService from '../../../services/userService';
import  DialogModalStore  from '../../../stores/useDialogModalStore';
import  DialogMultipleMessagesModalStore  from '../../../stores/useDialogMultipleMessagesModalStore';
import { validatePassword } from '../../../utils/validators/userValidators';
import Button from '../../buttons/landingPageBtn/Button';
import  useLabStore  from '../../../stores/useLabStore.jsx';


const RegisterForm = ( ) => {
   const { setDialogMultipleMessages, setDialogMultipleMessagesTitle, setIsDialogMultipleMessagesOpen } = DialogMultipleMessagesModalStore();
   const {setIsDialogOpen, setDialogMessage, setAlertType, setOnConfirm} = DialogModalStore();
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const [user, setUser] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      firstName: '',
      lastName: '',
      laboratoryId: '',
   });
   const [passwordStrength, setPasswordStrength] = useState(0);
   const [passwordError, setPasswordError] = useState('');
   const [passwordStrongEnough, setpasswordStrongEnough] = useState(true);
   const { laboratories, fetchLaboratories } = useLabStore();


   useEffect(() => {
      fetchLaboratories();
    }, [fetchLaboratories]);

    const checkPasswordStrength = (password) => {
      const { isValid, errors, score } = validatePassword(password);
      setPasswordStrength(score);
      setPasswordError(errors.join(' '));
      setpasswordStrongEnough(isValid);

  };

   const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'password') {
         checkPasswordStrength(value);
        if (!validatePassword(value)) {
          setPasswordError('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
        } else {
          setPasswordError('');
        }
      }
      setUser(prevUser => ({
        ...prevUser,
        [name]: value
      }));
    };

   // const handleImageChange = (e) => {
   //    if (e.target.files[0]) {
   //      const file = e.target.files[0];
   //      setProfileImage(file);
   //      const reader = new FileReader();
   //      reader.onloadend = () => {
   //        setImagePreview(reader.result); 
   //      };
   //      reader.readAsDataURL(file);
   //    }
   //  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    const { confirmPassword, ...userData } = user;
    const newErrors = {
         Email: !user.email ? 'Email is required' : '',
         Password: !user.password ? ' is required' : '',
         Confirmation: user.password !== user.confirmPassword ? ' passwords do not match' : '',
         Passwords: passwordError !=='' ? passwordError : '',
         Username: !user.username ? ' is required' : '',
         Name: !user.firstName || !user.lastName ? 'First name and last name are required' : '',
         Laboratory: !user.laboratoryId ? ' is required' : '',
         Weak: passwordStrongEnough ? '' : 'Password is not strong enough'

    };
    const isValid = Object.keys(newErrors).every((key) => !newErrors[key]);
    if (isValid) {
       try {
          setLoading(true);
         //  if (profileImage) {
         //    const storageRef = ref(storage, `profile_images/${profileImage.name}`);
         //    const snapshot = await uploadBytes(storageRef, profileImage);
         //    const downloadURL = await getDownloadURL(snapshot.ref);
         //    userData.photo = downloadURL;
         //  }
          const response = await userService.registerUser(userData);
         if (response.status !== 204) {
               setLoading(false);
             const responseBody = await response.json();
             setDialogMessage(responseBody.errorMessage);
             setIsDialogOpen(true);
             setAlertType(true);
             setOnConfirm(async () => {
             });
         }
         else{
             setDialogMessage('Confirmation Email Sent');
             setIsDialogOpen(true);
             setAlertType(true);
             setOnConfirm(async () => {
                setLoading(false);
                navigate('/');
             });
          }
        } catch (error) {
          console.error('Error:', error.message);
          setLoading(false);
          setDialogMessage('Error: Please try again later., or contact support.');
            setIsDialogOpen(true);
            setAlertType(true);
            setOnConfirm(async () => {
            });
        }
    } else {
       const errorMessages = Object.entries(newErrors)
          .filter(([key, value]) => value !== '') 
          .map(([key, value]) => `${key}: ${value}`); 
       setDialogMultipleMessages(errorMessages);
       setDialogMultipleMessagesTitle('Validation Errors');
       setIsDialogMultipleMessagesOpen(true);
    }
  };

  return (
      <div className={styles.mainContent}>
         {loading && <div className="spinner"></div>}
         <form className={styles.registrationForm}>
            <div className={styles.formContent}>
               <div className={styles.formSection1}>
                  <label className={styles.label} id="email-label" htmlFor="email-field"><FormattedMessage id="email">Email</FormattedMessage></label>
                  <FormattedMessage id="emailPlaceholder">{(value) => (<input
                     className={styles.input} 
                     type="email"
                     name="email"
                     value={user.email}
                     onChange={handleChange}
                     id="email-field" 
                     maxLength="60" 
                     placeholder={value} 
                  />)}</FormattedMessage>
                  <label className={styles.label} id="password-label" htmlFor="password-field">
                     Password
                  </label>
                  <FormattedMessage id="passwordPlaceholder">{(value) => (<input
                     className={styles.input}
                     type="password"
                     name="password"
                     value={user.password}
                     onChange={handleChange}
                     id="password-field"
                     maxLength="25"
                     placeholder={value}
                  />)}</FormattedMessage>
                  <div className={styles.passwordStrength}>
                            <div style={{ width: `${passwordStrength * 25}%`, backgroundColor: passwordStrength >= 3 ? 'green' : 'yellow', height: '5px', marginTop: '5px' }}></div>
                        </div>
                        {passwordError && (
                            <div className={styles.passwordError}>
                                {passwordError}
                            </div>
                        )}
                  <label className={styles.label} id="password-label2" htmlFor="password2-field">Repeat Password</label>
                  <FormattedMessage id="passwordPlaceholder">{(value) => (<input
                     className={styles.input}
                     type="password"
                     name="confirmPassword"
                     value={user.confirmPassword}
                     onChange={handleChange}
                     id="password2-field"
                     maxLength="25"
                     placeholder={value}
                  />)}</FormattedMessage>
                  <label className={styles.label} id="username-label" htmlFor="username-field">Username</label>
                  <FormattedMessage id="usernamePlaceholder">{(value) => (<input
                     className={styles.input}
                     type="text"
                     name="username"
                     value={user.username}
                     onChange={handleChange}
                     id="username-field"
                     maxLength="25"
                     placeholder={value}
                  />)}</FormattedMessage>
                  <label className={styles.label} id="first-name-label" htmlFor="firstname-field"><FormattedMessage id="firstName">First Name</FormattedMessage></label>
                  <FormattedMessage id="firstNamePlaceholder">{(value) => (<input
                     className={styles.input}
                     type="text"
                     name="firstName"
                     value={user.firstName}
                     onChange={handleChange}
                     id="firstname-field"
                     maxLength="35"
                     placeholder={value}
                  />)}</FormattedMessage>
                  <label  className={styles.label} id="last-name-label" htmlFor="lastname-field"><FormattedMessage id="lastName">Last Name</FormattedMessage></label>
                  <FormattedMessage id="lastNamePlaceholder">{(value) => (<input
                     className={styles.input}
                     type="text"
                     name="lastName"
                     value={user.lastName}
                     onChange={handleChange}
                     id="lastname-field"
                     maxLength="35"
                     placeholder={value}
                  />)}</FormattedMessage>
                  <div>
                     <label className={styles.label} htmlFor="laboratoryId-field">
                           <FormattedMessage id="laboratoryId" defaultMessage="Laboratory" />
                     </label>
                     <FormattedMessage id="laboratoryPlaceholder" defaultMessage="Select your laboratory">
                           {(placeholder) => (
                           <select
                              className={styles.select}
                              name="laboratoryId"
                              onChange={handleChange}
                              id="laboratoryId-field"
                           >
                              <option value="">{placeholder}</option>
                              {laboratories.map((lab) => (
                              <option key={lab.id} value={lab.id}>
                                 {lab.location}
                              </option>
                              ))}
                           </select>
                           )}
                     </FormattedMessage>
                  </div>
                  <div className={styles.btnDiv}>
                     <Button onClick={handleSubmit} tradId="register" defaultText="Register" btnColor={"var(--btn-color2)"} backgroundColor={"var(--btn-background2)"}/>
                     <Button path="/" tradId="back" defaultText="Back"btnColor={"var(--btn-color2)"} backgroundColor={"var(--btn-background2)"}/>  
                  </div>

               </div>
                  {/* <div className={styles.imageContainer}>
                     <img
                     src={imagePreview || placeHolderProfileImage} 
                     alt="Profile Preview"
                     className={styles.imagePreview}
                     />
                     <label htmlFor="profileImage" className={styles.labelButton}>
                     <FormattedMessage id="uploadImage" defaultMessage="Upload Image" />
                     </label>
                     <input
                     type="file"
                     id="profileImage"
                     className={styles.fileInput}
                     onChange={handleImageChange}
                     />
                  </div>
                  <label className={styles.label} id="biography" htmlFor="biography-field"><FormattedMessage id="biography">Biography</FormattedMessage></label>
                  <FormattedMessage id="biographyPlaceholder">{(value) => (<input
                     className={styles.input}
                     type="text"
                     name="biography" 
                     value={user.biography}
                     onChange={handleChange}
                     id="biography-field" 
                     maxLength="1000" 
                     placeholder={value}
                     />)}</FormattedMessage> */}
           
            </div>
         </form>
      </div>    
  );
};

export default RegisterForm;
