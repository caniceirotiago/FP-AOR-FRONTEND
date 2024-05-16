import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.css';
import {FormattedMessage} from 'react-intl';
import labService from '../../../services/labService';
import userService from '../../../services/userService';
import  DialogModalStore  from '../../../stores/useDialogModalStore';
import  DialogMultipleMessagesModalStore  from '../../../stores/useDialogMultipleMessagesModalStore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../../firebase';

const RegisterForm = ( ) => {
   const { setDialogMultipleMessages, setDialogMultipleMessagesTitle, setIsDialogMultipleMessagesOpen } = DialogMultipleMessagesModalStore();
   const {setIsDialogOpen, setDialogMessage, setAlertType, setOnConfirm} = DialogModalStore();
   const [profileImage, setProfileImage] = useState(null);
   const [imagePreview, setImagePreview] = useState(null);
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const [laboratories, setLaboratories] = useState([]);
   const [user, setUser] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      firstName: '',
      lastName: '',
      photo: '',
      biography: '',
      laboratoryId: '',
   });
   useEffect(() => {
    const fetchLaboratories = async () => {
      try {
        const response = await labService.fetchAllLabs(); 
        const data = await response.json();
        console.log(data);
        setLaboratories(data);
      } catch (error) {
        console.error('Error fetching labs:', error);
      }
    };
    fetchLaboratories();
  }, []);
   
   const handleChange = (e) => {
      const { name, value } = e.target;
      setUser(prevUser => ({
         ...prevUser,
         [name]: value
      }));
   };
   const handleImageChange = (e) => {
      if (e.target.files[0]) {
        const file = e.target.files[0];
        setProfileImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result); 
        };
        reader.readAsDataURL(file);
      }
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    const { confirmPassword, ...userData } = user;
    const newErrors = {
         email: !user.email ? 'Email is required' : '',
         password: !user.password ? 'Password is required' : '',
         confirmPassword: user.password !== user.confirmPassword ? 'Passwords do not match' : '',
         nickname: !user.nickname ? 'Nickname is required' : '',
         firstName: !user.firstName ? 'First name is required' : '',
         lastName: !user.lastName ? 'Last name is required' : '',
         laboratoryId: !user.laboratoryId ? 'Laboratory is required' : '',
    };
    const isValid = Object.keys(newErrors).every((key) => !newErrors[key]);
    console.log(isValid);
    if (isValid) {
       try {
          setLoading(true);
          if (profileImage) {
            const storageRef = ref(storage, `profile_images/${profileImage.name}`);
            const snapshot = await uploadBytes(storageRef, profileImage);
            const downloadURL = await getDownloadURL(snapshot.ref);
            userData.photo = downloadURL;
          }
          console.log(userData);
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
                console.log(loading);
                setLoading(false);
                navigate('/');
             });
          }
        } catch (error) {
          console.error('Error:', error.message);
          setLoading(false);
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
         <form className={styles.registrationForm} onSubmit={handleSubmit}>
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
                  <label className={styles.label} id="password-label" htmlFor="password-field">Password</label>
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
                  <label className={styles.label} id="nickname-label" htmlFor="nickname-field">Nickname</label>
                  <FormattedMessage id="nicknamePlaceholder">{(value) => (<input
                     className={styles.input}
                     type="text"
                     name="nickname"
                     value={user.nickname}
                     onChange={handleChange}
                     id="nickname-field"
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
                  
               </div>
               <div className={styles.formSection2}>
                  <div className={styles.imageContainer}>
                     <img
                     src={imagePreview || 'default-profile.png'} // Imagem padrão ou pré-visualização
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
               <FormattedMessage id="registration">{(value) => (<input type="submit" id="registration" value={value}/>)}</FormattedMessage>
               <button className={styles.backButton} onClick={() => navigate('/')}><FormattedMessage id="back">Back</FormattedMessage></button>                
               </div>
               
            </div>
         </form>
      </div>    
  );
};

export default RegisterForm;
