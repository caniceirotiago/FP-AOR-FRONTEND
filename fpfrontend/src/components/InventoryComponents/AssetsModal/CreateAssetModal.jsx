import React, { useState, useEffect } from 'react';
import assetService from '../../../services/assetService';
import styles from './CreateAssetModal.module.css';
import useLabStore from '../../stores/useLabStore.jsx';
import { FormattedMessage } from 'react-intl';
import AttributeEditor from '../reactSelect/AttributeEditor.jsx';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import projectService from '../../services/projectService.jsx';
import useDialogModalStore from '../../stores/useDialogModalStore.jsx';

const CreateAssetModal = ({ isOpen, onClose }) => {
  const [assetData, setAssetData] = useState({
    name: '',
    type: '',
    description: '',
    stockQuantity: '',
    partNumber: '',
    manufacturer: '',
    manufacturerPhone: '',
    observations: '',
    projectId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData({
      ...assetData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await assetService.createAsset(assetData);
      if (response.ok) {
        // Handle success, maybe refresh assets list or show a success message
        onClose();
      } else {
        console.error("Error creating asset:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Create Asset</h2>
          <button className={styles.closeButton} onClick={onClose}>X</button>
        </div>
        <div className={styles.modalBody}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>Asset Name</label>
            <input
              className={styles.input}
              type="text"
              name="name"
              value={assetData.name}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>Type</label>
            <input
              className={styles.input}
              type="text"
              name="type"
              value={assetData.type}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              name="description"
              value={assetData.description}
              onChange={handleChange}
            />
            <label className={styles.label}>Stock Quantity</label>
            <input
              className={styles.input}
              type="number"
              name="stockQuantity"
              value={assetData.stockQuantity}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>Part Number</label>
            <input
              className={styles.input}
              type="text"
              name="partNumber"
              value={assetData.partNumber}
              onChange={handleChange}
            />
            <label className={styles.label}>Manufacturer</label>
            <input
              className={styles.input}
              type="text"
              name="manufacturer"
              value={assetData.manufacturer}
              onChange={handleChange}
            />
            <label className={styles.label}>Manufacturer Phone</label>
            <input
              className={styles.input}
              type="text"
              name="manufacturerPhone"
              value={assetData.manufacturerPhone}
              onChange={handleChange}
            />
            <label className={styles.label}>Observations</label>
            <textarea
              className={styles.textarea}
              name="observations"
              value={assetData.observations}
              onChange={handleChange}
            />
            <label className={styles.label}>Project ID</label>
            <input
              className={styles.input}
              type="number"
              name="projectId"
              value={assetData.projectId}
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.button}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssetModal;

