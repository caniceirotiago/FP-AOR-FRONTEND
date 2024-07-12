import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import assetService from "../../../services/assetService";
import styles from "./CreateAssetModal.module.css";
import "react-datepicker/dist/react-datepicker.css";
import useDialogModalStore from "../../../stores/useDialogModalStore.jsx";
import useAssetTypeStore from "../../../stores/useAssetsStore.jsx";


const CreateAssetModal = ({ isOpen, onClose }) => {
    // Destructure state management functions from the dialog modal store
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();
    // Destructure asset types and fetch function from the asset type store
  const { types, fetchAssetTypes } = useAssetTypeStore();
    // Initialize state for the asset form data
  const [assetData, setAssetData] = useState({
    name: "",
    type: "",
    description: "",
    stockQuantity: "",
    partNumber: "",
    manufacturer: "",
    manufacturerPhone: "",
    observations: "",
  });

  // Fetch asset types when the component mounts
  useEffect(() => {
    fetchAssetTypes();
  }, [fetchAssetTypes]);

  // Handle form input changes and update the asset data state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData({
      ...assetData,
      [name]: value,
    });
  };

  // Handle form submission to create a new asset
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await assetService.createAsset(assetData);
      if (response.ok) {
        // Handle success
        setDialogMessage(
          <FormattedMessage
          id="assetCreatedSuccess"
          defaultMessage="Asset created successfully!"
        />);
        setAlertType("success");
        setIsDialogOpen(true);
        setOnConfirm(() => {
          onClose();
          setIsDialogOpen(false);
        });
        // Reset asset data form to initial state
        setAssetData({
          name: "",
          type: "",
          description: "",
          stockQuantity: "",
          partNumber: "",
          manufacturer: "",
          manufacturerPhone: "",
          observations: "",
        });
      } else {
         // Handle errors in asset creation
        console.error("Error creating asset:", response.statusText);
        const data = await response.json();
        setDialogMessage(data.message);
        setAlertType(true);
        setIsDialogOpen(true);
        setOnConfirm(() => {});
      }
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

   // Render nothing if the modal is not open
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.closeButton} onClick={onClose}>
          X
        </div>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}><FormattedMessage id="assetName" defaultMessage="Asset Name" /></label>
            <input
              className={styles.input}
              type="text"
              name="name"
              value={assetData.name}
              onChange={handleChange}
              required
            />
            <label className={styles.label}><FormattedMessage id="type" defaultMessage="Type" /></label>
            <select
              className={styles.select}
              name="type"
              value={assetData.type}
              onChange={handleChange}
              required
            >
              <option value=""><FormattedMessage id="selectType" defaultMessage="Select a type" /></option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label className={styles.label}><FormattedMessage id="description" defaultMessage="Description" /></label>
            <textarea
              className={styles.textarea}
              name="description"
              value={assetData.description}
              onChange={handleChange}
              required
            />
            <label className={styles.label}><FormattedMessage
                id="stockQuantity"
                defaultMessage="Stock Quantity"
              /></label>
            <input
              className={styles.input}
              type="number"
              name="stockQuantity"
              value={assetData.stockQuantity}
              onChange={handleChange}
              required
            />
            <label className={styles.label}><FormattedMessage id="partNumber" defaultMessage="Part Number" /></label>
            <input
              className={styles.input}
              type="text"
              name="partNumber"
              value={assetData.partNumber}
              onChange={handleChange}
              required
            />
            <label className={styles.label}><FormattedMessage
                id="manufacturer"
                defaultMessage="Manufacturer"
              /></label>
            <input
              className={styles.input}
              type="text"
              name="manufacturer"
              value={assetData.manufacturer}
              onChange={handleChange}
              required
            />
            <label className={styles.label}> <FormattedMessage
                id="manufacturerPhone"
                defaultMessage="Manufacturer Phone"
              /></label>
            <input
              className={styles.input}
              type="tel"
              name="manufacturerPhone"
              value={assetData.manufacturerPhone}
              onChange={handleChange}
              required
            />
            <label className={styles.label}><FormattedMessage
                id="observations"
                defaultMessage="Observations"
              /></label>
            <textarea
              className={styles.textarea}
              name="observations"
              value={assetData.observations}
              onChange={handleChange}
            />
            <button type="submit" className={styles.button}>
            <FormattedMessage id="submitButton" defaultMessage="Submit" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssetModal;
