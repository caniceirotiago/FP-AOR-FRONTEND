// src/components/SelectQuantityModal.jsx
import React from "react";
import { FormattedMessage } from "react-intl";
import useSelectQuantityModalStore from "../../stores/useSelectQuantityModalStore";
import styles from "./SelectQuantityModal.module.css";

const SelectQuantityModal = () => {
  const { showModal, setShowModal, resolveSelection, usedQuantity, reset } = useSelectQuantityModalStore();

  const handleConfirm = () => {
    resolveSelection(usedQuantity);
    setShowModal(false);
    reset();
  };

  return (
    showModal && (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <input
            type="number"
            value={usedQuantity}
            onChange={(e) => resolveSelection(parseInt(e.target.value))}
            min="1"
          />
          <button onClick={handleConfirm}><FormattedMessage id="confirm" defaultMessage="Confirm" /></button>
          <button onClick={reset}><FormattedMessage id="cancel" defaultMessage="Cancel" /></button>
        </div>
      </div>
    )
  );
};

export default SelectQuantityModal;
