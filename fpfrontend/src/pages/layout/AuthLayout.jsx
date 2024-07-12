import React from "react";
import styles from "./AuthLayout.module.css";
import NonAuthHeader from "../../components/headers/NonAuthHeader";

const AuthLayout = ({ children }) => {
  return (
    <>
      <div className={styles.main}>
        <NonAuthHeader />
        <div className={styles.board}>{children}</div>
      </div>
    </>
  );
};

export default AuthLayout;
