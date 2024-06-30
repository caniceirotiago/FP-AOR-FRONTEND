import React, { useState } from "react";
import styles from "./PasswordForm.module.css";
import { FormattedMessage, useIntl } from "react-intl";
import { validatePassword } from "../../../utils/validators/userValidators.jsx";
import userService from "../../../services/userService.jsx";
import useDialogModalStore from "../../../stores/useDialogModalStore.jsx";
import DialogMultipleMessagesModalStore from "../../../stores/useDialogMultipleMessagesModalStore.jsx";
import Button from "../../buttons/landingPageBtn/Button.jsx";
import PasswordRulesLegend from "../../legend/PasswordRulesLegend.jsx";

/**
 * PasswordForm provides a form for users to update their password. It includes fields for the old password,
 * new password, and confirmation of the new password. Input validation is performed to ensure the new passwords
 * match and meet the specified criteria before submission. Upon successful validation, the onUpdateUserPassword
 * callback is called to handle the password update process.
 */

const PasswordForm = () => {
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();
  const {
    setDialogMultipleMessages,
    setDialogMultipleMessagesTitle,
    setIsDialogMultipleMessagesOpen,
  } = DialogMultipleMessagesModalStore();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrongEnough, setpasswordStrongEnough] = useState(true);
  const intl = useIntl();

  const messages = {
    passwordRequired: {
      id: "passwordRequired",
      defaultMessage: "Password is required",
    },
    passwordsDoNotMatch: {
      id: "passwordsDoNotMatch",
      defaultMessage: "Passwords do not match",
    },
    passwordError: {
      id: "passwordValidationError",
      defaultMessage:
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
    },
    passwordNotStrongEnough: {
      id: "passwordNotStrongEnough",
      defaultMessage: "Password is not strong enough",
    },
    passwordChangedSuccess: {
      id: "passwordChangedSuccess",
      defaultMessage: "Password Changed Successfully!",
    },
    passwordChangeFailed: {
      id: "passwordUpdateFail",
      defaultMessage: "Not able to change password, contact support.",
    },
    validationErrors: {
      id: "validationErrors",
      defaultMessage: "Validation Errors",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
    if (name === "newPassword") {
      checkPasswordStrength(value);
      if (!validatePassword(value)) {
        setPasswordError(intl.formatMessage(messages.passwordError));
      } else {
        setPasswordError("");
      }
    }
  };

  const checkPasswordStrength = (password) => {
    const { isValid, errors, score } = validatePassword(password);
    setPasswordStrength(score);
    setPasswordError(errors.join(" "));
    setpasswordStrongEnough(isValid);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = passwords;

    const newErrors = {
      1: !passwords.oldPassword
        ? intl.formatMessage(messages.passwordRequired)
        : "",
      2:
        passwords.newPassword !== passwords.confirmNewPassword
          ? intl.formatMessage(messages.passwordsDoNotMatch)
          : "",
      3: passwordError !== "" ? passwordError : "",
      4: passwordStrongEnough
        ? ""
        : intl.formatMessage(messages.passwordNotStrongEnough),
    };
    const isValid = Object.keys(newErrors).every((key) => !newErrors[key]);
    if (isValid) {
      try {
        const response = await userService.updateUserPassword(
          oldPassword,
          newPassword
        );
        if (response.status === 204) {
          setDialogMessage(intl.formatMessage(messages.passwordChangedSuccess));
          setIsDialogOpen(true);
          setAlertType(true);
          setOnConfirm(async () => {});
        } else {
          setDialogMessage(intl.formatMessage(messages.passwordChangeFailed));
          setIsDialogOpen(true);
          setAlertType(true);
          setOnConfirm(async () => {});
        }

        setPasswords({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } catch (error) {}
    } else {
      const errorMessages = Object.entries(newErrors)
        .filter(([key, value]) => value !== "")
        .map(([key, value]) => `${key}: ${value}`);
      setDialogMultipleMessages(errorMessages);
      setDialogMultipleMessagesTitle(
        intl.formatMessage(messages.validationErrors)
      );
      setIsDialogMultipleMessagesOpen(true);
    }
  };

  return (
    <div className={styles.passwordForm}>
      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="oldPassword">
            <FormattedMessage id="oldPassword">Old Password </FormattedMessage>
          </label>
          <input
            className={styles.input}
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="newPassword">
            <FormattedMessage id="newPassword">New Password</FormattedMessage>
          </label>
          <input
            className={styles.input}
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
          />
        </div>
        <PasswordRulesLegend /> 
        <div className={styles.passwordStrength}>
          <div
            style={{
              width: `${passwordStrength * 25}%`,
              backgroundColor: passwordStrength >= 3 ? "green" : "yellow",
              height: "5px",
              marginTop: "5px",
            }}
          ></div>
        </div>
        {passwordError && (
          <div className={styles.passwordError}>{passwordError}</div>
        )}
        <label></label>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="confirmNewPassword">
            <FormattedMessage id="confirmNewPassword">
              Confirm New Password
            </FormattedMessage>
          </label>
          <input
            className={styles.input}
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={passwords.confirmNewPassword}
            onChange={handleChange}
          />
        </div>
        <Button
          className={styles.input}
          onClick={handleSubmit}
          tradId={"updatePasswordbtn"}
          defaultText={"Update Password"}
          btnColor={"var(--btn-color2)"}
        />
      </form>
    </div>
  );
};

export default PasswordForm;
