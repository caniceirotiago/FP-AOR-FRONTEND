// src/components/SelectTypeModal.jsx
import React from 'react';
import { FormattedMessage } from "react-intl";
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
        <h2 className={styles.title}><FormattedMessage id="selectType" defaultMessage="Select Type" /></h2>
        <ul className={styles.list}>
          {options.map((option) => (
            <li className={styles.option} key={option} onClick={() => handleSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
        <button className={styles.cancelBtn} onClick={reset}><FormattedMessage id="cancel" defaultMessage="Cancel" /></button>
      </div>
    </div>
  );
};

export default SelectTypeModal;
