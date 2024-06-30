import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import userService from "../../../services/userService.jsx";
import { FormattedMessage, useIntl } from "react-intl";
import useDialogModalStore from "../../../stores/useDialogModalStore.jsx";
import styles from "./ResetPasswordForm.module.css";
import { validatePassword } from "../../../utils/validators/userValidators.jsx";
import Button from "../../buttons/landingPageBtn/Button.jsx";
import DialogMultipleMessagesModalStore from "../../../stores/useDialogMultipleMessagesModalStore.jsx";
import PasswordRulesLegend from "../../legend/PasswordRulesLegend.jsx";


const ResetPasswordForm = () => {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const {
    setDialogMultipleMessages,
    setDialogMultipleMessagesTitle,
    setIsDialogMultipleMessagesOpen,
  } = DialogMultipleMessagesModalStore();
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();
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
        defaultMessage: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
      },
    passwordNotStrongEnough: {
      id: "passwordNotStrongEnough",
      defaultMessage: "Password is not strong enough",
    },
    passwordChangedSuccess: {
      id: "passwordChangedSuccess",
      defaultMessage: "Password Changed Successfully",
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
    if (name === "password") {
      checkPasswordStrength(value);
      if (!validatePassword(value)) {
        setPasswordError(
            intl.formatMessage(messages.passwordError)
          );
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      1: !passwords.password
        ? intl.formatMessage(messages.passwordRequired)
        : "",
      2:
        passwords.password !== passwords.confirmPassword
          ? intl.formatMessage(messages.passwordsDoNotMatch)
          : "",
      3:
        passwordError !== ""
          ? intl.formatMessage(messages.passwordError, { passwordError })
          : "",
      4: passwordStrongEnough
        ? ""
        : intl.formatMessage(messages.passwordNotStrongEnough),
    };

    const isValid = Object.keys(newErrors).every((key) => !newErrors[key]);
    if (isValid) {
      try {
        const response = await userService.resetPassword(
          token,
          passwords.password
        );
        if (response.status === 204) {
            setDialogMessage(intl.formatMessage(messages.passwordChangedSuccess));
          setIsDialogOpen(true);
          setAlertType(true);
          setOnConfirm(async () => {
            navigate("/");
          });
          return;
        }
        setDialogMessage(intl.formatMessage(messages.passwordChangeFailed));
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {
          navigate("/");
        });
      } catch (error) {
        console.error("Error :", error);
      }
    } else {
      const errorMessages = Object.entries(newErrors)
        .filter(([key, value]) => value !== "")
        .map(([key, value]) => `${key}: ${value}`);
      setDialogMultipleMessages(errorMessages);
      setDialogMultipleMessagesTitle(intl.formatMessage(messages.validationErrors));
      setIsDialogMultipleMessagesOpen(true);
    }
  };

  return (
    <div className={styles.mainContent}>
      <form className={styles.form}>
        <h2>
          <FormattedMessage id="changePassword">
            Change Password
          </FormattedMessage>
        </h2>
        <label>
          <FormattedMessage id="newPassword"> New Password:</FormattedMessage>
          <input
            name="password"
            className={styles.input}
            type="password"
            value={passwords.password}
            onChange={handleChange}
            required
            minLength={4}
          />
        </label>
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
        <label>
          <FormattedMessage id="confirmPassword">
            Confirm Password:
          </FormattedMessage>
          <input
            name="confirmPassword"
            className={styles.input}
            type="password"
            value={passwords.confirmPassword}
            onChange={handleChange}
            required
            minLength={4}
          />
        </label>
        <Button
          onClick={handleSubmit}
          tradId="changePassword"
          defaultText="Change Password"
          btnColor={"var(--btn-bolor2)"}
        />
      </form>
    </div>
  );
};

export default ResetPasswordForm;
