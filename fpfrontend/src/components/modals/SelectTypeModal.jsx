// src/components/SelectTypeModal.jsx
import React from 'react';
import useSelectTypeModal from '../../stores/useSelectTypeModal';
import styles from './SelectTypeModal.module.css';

const SelectTypeModal = () => {
  const { showModal, options, setSelectedOption, setShowModal, reset } = useSelectTypeModal();

  const handleSelect = (option) => {
    setSelectedOption(option);
    setShowModal(false);
    reset();
  };

  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Select Type</h2>
        <ul>
          {options.map((option) => (
            <li key={option} onClick={() => handleSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
        <button onClick={reset}>Cancel</button>
      </div>
    </div>
  );
};

export default SelectTypeModal;
