import React, { useState } from "react";
import styles from "./PasswordRulesLegend.module.css";
import useDeviceStore from "../../stores/useDeviceStore.jsx";
import { FormattedMessage } from "react-intl";

const PasswordRulesLegend = () => {
  const [showLegend, setShowLegend] = useState(false);
  const { isTouch } = useDeviceStore();

  const handleToggleLegend = () => {
    setShowLegend((prevShowLegend) => !prevShowLegend);
  };

  return (
    <div className={styles.legendContainer}>
      <div
        className={styles.infoIcon}
        onMouseEnter={() => !isTouch && setShowLegend(true)}
        onMouseLeave={() => !isTouch && setShowLegend(false)}
        onClick={isTouch ? handleToggleLegend : null}
      >
        i
      </div>
      {showLegend && (
        <div className={styles.legendContent}>
          <FormattedMessage
            id="passwordRules"
            defaultMessage="Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, a special character, and should not contain spaces."
          />
        </div>
      )}
    </div>
  );
};

export default PasswordRulesLegend;
