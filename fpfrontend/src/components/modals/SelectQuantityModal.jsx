// src/components/SelectQuantityModal.jsx
import React, { useState } from "react";
import useSelectQuantityModalStore from "../../stores/useSelectQuantityModalStore";
import styles from "./SelectQuantityModal.module.css";

const SelectQuantityModal = () => {
  const [quantity, setQuantity] = useState(1);
  const { showModal, setShowModal, resolveSelection } = useSelectQuantityModalStore();

  const handleConfirm = () => {
    resolveSelection(quantity);
    setShowModal(false);
  };

  return (
    showModal && (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
          />
          <button onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    )
  );
};

export default SelectQuantityModal;
