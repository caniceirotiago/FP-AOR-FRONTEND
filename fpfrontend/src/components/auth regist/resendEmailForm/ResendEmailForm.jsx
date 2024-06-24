import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { FaEnvelope } from "react-icons/fa";
import userService from "../../../services/userService";
import styles from "./ResendEmailForm.module.css";
import DialogModalStore from "../../../stores/useDialogModalStore";
import Button from "../../buttons/landingPageBtn/Button.jsx";

const ResendEmailForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { setIsDialogOpen, setDialogMessage, setAlertType, setOnConfirm } =
    DialogModalStore();
  const intl = useIntl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.requestNewConfirmationEmail(email);
      if (response.status === 204) {
        setDialogMessage(
          intl.formatMessage({
            id: "confirmationEmailSent",
            defaultMessage: "Confirmation Email Sent",
          })
        );
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {
          navigate("/");
        });
      } else {
        const responseBody = await response.json();
        setDialogMessage(responseBody.errorMessage);
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {
          navigate("/");
        });
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };

  return (
    <div className={styles.mainContent}>
      <form className={styles.form}>
        <div className={styles.banner}>
          <FaEnvelope className={styles.loginIcon} />
          <p className={styles.memberLoginBanner}>
            <FormattedMessage id="resendEmail">
              Resend Confirmation Email
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
            tradId="askForNewConfirmation"
            defaultText="Ask For New Confirmation"
            btnColor={"var(--btn-color2)"}
          />
          <Button
            onClick={() => navigate("/")}
            tradId="back"
            defaultText="Back"
            btnColor={"var(--btn-color2)"}
          />
        </div>
      </form>
    </div>
  );
};

export default ResendEmailForm;
