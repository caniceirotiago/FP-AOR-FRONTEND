// src/components/SelectQuantityModal.jsx
import React from "react";
import { FormattedMessage } from "react-intl";
import useSelectQuantityModalStore from "../../stores/useSelectQuantityModalStore";
import styles from "./SelectQuantityModal.module.css";

const SelectQuantityModal = () => {
  const { showModal, setShowModal, resolveSelection, usedQuantity, setUsedQuantity, reset } = useSelectQuantityModalStore();

  const handleConfirm = () => {
    resolveSelection(usedQuantity);
    setShowModal(false);
    reset();
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setUsedQuantity(value);
    }
  };

  return (
    showModal && (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <input
            className={styles.input}
            type="number"
            value={usedQuantity}
            onChange={handleChange}
            min="1"
          />
          <button className={styles.confirmBtn} onClick={handleConfirm}><FormattedMessage id="confirm" defaultMessage="Confirm" /></button>
          <button className={styles.cancelBtn} onClick={reset}><FormattedMessage id="cancel" defaultMessage="Cancel" /></button>
        </div>
      </div>
    )
  );
};

export default SelectQuantityModal;
