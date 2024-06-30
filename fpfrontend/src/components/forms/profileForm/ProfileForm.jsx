import React, { useState, useEffect } from "react";
import styles from "./ProfileForm.module.css";
import { FormattedMessage } from "react-intl";
import userService from "../../../services/userService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase";
import useLabStore from "../../../stores/useLabStore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useDialogModalStore from "../../../stores/useDialogModalStore";
import Button from "../../buttons/landingPageBtn/Button.jsx";
import { set } from "date-fns";

const ProfileForm = ({userProfileInfo,isOwnProfile,fetchUserData,isEditing,}) => {
  
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } = useDialogModalStore();
  const [profileImage, setProfileImage] = useState(null);
  const { laboratories, fetchLaboratories } = useLabStore();
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    biography: "",
    laboratoryId: "",
    private: "",
    photo: "",
  });

  useEffect(() => {
    setProfile({ ...userProfileInfo });
  }, [userProfileInfo]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      // Verificar o tipo de arquivo
      const fileType = file.type;
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(fileType)) {
        setDialogMessage( <FormattedMessage id="invalidFileType" defaultMessage="Invalid file type. Please upload a JPEG or PNG file." />);
        setIsDialogOpen(true);
        setOnConfirm(async () => {});
        setAlertType(true);
        return;
      }
      // Verificar o tamanho do arquivo (5MB = 5 * 1024 * 1024 bytes)
      const fileSize = file.size;
      const maxSize = 5 * 1024 * 1024;
      if (fileSize > maxSize) {
        setDialogMessage( <FormattedMessage id="fileTooLarge" defaultMessage="File too large. Please upload a file smaller than 5MB." />);
        setAlertType(true);
        setIsDialogOpen(true);
        setOnConfirm(async () => {});
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        //setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    fetchLaboratories();
  }, [fetchLaboratories]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleBiographyChange = (value) => {
    setProfile((prev) => ({ ...prev, biography: value }));
  };

  const onUpdateSuccess = () => {
    fetchUserData();
  };

  const handleUpdateUserProfile = async () => {
    try {
      if (profileImage) {
        const storageRef = ref(storage, `profile_images/${profileImage.name}`);
        const snapshot = await uploadBytes(storageRef, profileImage);
        const downloadURL = await getDownloadURL(snapshot.ref);
        profile.photo = downloadURL;
        localStorage.setItem("photo", downloadURL);
      }
      const { email, id, username, ...profileData } = profile;
      console.log(profileData);
      const result = await userService.updateUser(profileData);
      if (result.status === 204) {
        onUpdateSuccess();
        setDialogMessage(
          <FormattedMessage
            id="profileUpdateSuccess"
            defaultMessage="Profile updated successfully!"
          />
        );
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {});
      } else {
        setDialogMessage(
          <FormattedMessage
            id="profileUpdateFail"
            defaultMessage="Failed to update profile. Please try again."
          />
        );
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {});
      }
    } catch (error) {
      setDialogMessage(
          <FormattedMessage
            id="profileUpdateFail"
            defaultMessage="Failed to update profile. Please try again."
          />
        );
      setIsDialogOpen(true);
      setAlertType(true);
      setOnConfirm(async () => {});
      console.error("Failed to update user profile:", error);
    }
  };

  return (
    <div className={styles.Profile}>
      <form className={styles.formProfile}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            <FormattedMessage id="email">Email</FormattedMessage>
          </label>
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
          <label className={styles.label} htmlFor="firstName">
            <FormattedMessage id="firstName">First Name</FormattedMessage>
          </label>
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
          <label className={styles.label} htmlFor="lastName">
            <FormattedMessage id="lastName">Last Name</FormattedMessage>
          </label>
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

        <div className={styles.inputGroupBigBox}>
          <label className={styles.label} htmlFor="biography">
            <FormattedMessage id="biography">Biography</FormattedMessage>
          </label>
          {isEditing ? (
           <textarea
            className={styles.textarea}
            id="biography"
            name="biography"
            value={profile.biography}
            onChange={handleInputChange}
            placeholder="Enter your biography"
            disabled={!isEditing}
          />
          ) : (
            <div className={styles.biographyText}>
              <div dangerouslySetInnerHTML={{ __html: profile.biography }} />
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="laboratoryId">
            <FormattedMessage id="laboratoryId">Laboratory ID</FormattedMessage>
          </label>
          <FormattedMessage
            id="laboratoryPlaceholder"
            defaultMessage="Select your laboratory"
          >
            {(placeholder) => (
              <select
                className={styles.select}
                name="laboratoryId"
                onChange={handleInputChange}
                id="laboratoryId-field"
                disabled={!isEditing}
                value={profile.laboratoryId}
              >
                {laboratories.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.location}
                  </option>
                ))}
              </select>
            )}
          </FormattedMessage>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="private">
            <FormattedMessage id="private">Private</FormattedMessage>
          </label>
          <select
            className={styles.select}
            id="private"
            name="private"
            value={profile.private}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>
        </div>
        <div className={styles.inputGroup} hidden={!isEditing}>
          <label
            htmlFor="profileImage"
            className={styles.label}
            hidden={!isEditing}
          >
            <FormattedMessage
              id="uploadNewImage"
              defaultMessage="Upload New Image"
            />
          </label>
          <div className={styles.updateFilebtn}>
            <input
              type="file"
              id="profileImage"
              className={styles.inputFile}
              onChange={handleImageChange}
              disabled={!isEditing}
              hidden={!isEditing}
            />
          </div>
        </div>
      </form>
      {isEditing ? (
        <Button
          className={styles.button}
          onClick={handleUpdateUserProfile}
          tradId="updateUserBasicInformations"
          defaultText="Update User Basic Information"
          btnColor={"var(--btn-color2)"}
        />
      ) : (
        isOwnProfile && null
      )}
    </div>
  );
};

export default ProfileForm;
