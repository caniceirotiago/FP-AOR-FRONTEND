import React, { useState } from "react";
import userService from "../../../services/userService.jsx";
import styles from "./ForgotPasswordForm.module.css";
import { FormattedMessage, useIntl } from "react-intl";
import { FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useDialogModalStore from "../../../stores/useDialogModalStore";
import Button from "../../buttons/landingPageBtn/Button.jsx";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { setIsDialogOpen, setDialogMessage, setAlertType, setOnConfirm } =
    useDialogModalStore();
  const [email, setEmail] = useState("");
  const intl = useIntl();

  const messages = {
    emailSent: {
      id: "emailSent",
      defaultMessage: "Recover password email sent",
    },
    emailRequestError: {
      id: "emailRequestError",
      defaultMessage:
        "You already requested a password reset, please check your email, wait 30 minutes and try again, or contact the administrator",
    },
    emailSendFailure: {
      id: "emailSendFailure",
      defaultMessage: "Not able to send email, contact support.",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.requestPasswordReset(email);
      if (response.status === 204) {
        setDialogMessage(intl.formatMessage(messages.emailSent));
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {
          navigate("/");
        });
        return;
      }
      const responseBody = await response.json();
      if (response.status !== 204) {
        setDialogMessage(responseBody.message);
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {});
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };

  return (
    <div className={styles.mainContent}>
      <form className={styles.form}>
        <div className={styles.banner}>
          <FaKey className={styles.loginIcon} />
          <p className={styles.memberLoginBanner}>
            <FormattedMessage id="recoverPassword">
              Recover Password
            </FormattedMessage>
          </p>
        </div>
        <label htmlFor="email">Email</label>
        <input
          className={styles.input}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className={styles.btnDiv}>
          <Button
            onClick={handleSubmit}
            tradId="askForNewPassword"
            defaultText="Ask for new password"
            btnColor={"var(--btn-bolor2)"}
          />
          <Button
            path="/"
            tradId="backToLogin"
            defaultText="Back to login"
            btnColor={"var(--btn-bolor2)"}
          />
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
