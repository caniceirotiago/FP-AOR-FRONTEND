import React, { useState, useEffect } from "react";
import assetService from "../../../services/assetService";
import styles from "./EditAssetModal.module.css";
import { FormattedMessage } from "react-intl";
import "react-datepicker/dist/react-datepicker.css";
import useDialogModalStore from "../../../stores/useDialogModalStore.jsx";
import useAssetTypeStore from "../../../stores/useAssetTypeStore.jsx";

const EditAssetModal = ({ isOpen, onClose, asset }) => {
    const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();
    const [assetData, setAssetData] = useState(asset);

    useEffect(() => {
        // Update the assetData whenever the asset prop changes
        setAssetData(asset);
    }, [asset]);

  const { types, fetchAssetTypes } = useAssetTypeStore();

  useEffect(() => {
    fetchAssetTypes();
  }, [fetchAssetTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData({
        ...assetData,
        [name]: value,
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Asset data:", asset);
      console.log("Asset Id:", asset.id);
// Remove the id field from assetData
const { id, ...updateData } = assetData;
console.log("Update data:", updateData);

        const response = await assetService.updateAsset(asset.id, updateData);
        if (response.ok) {
            setDialogMessage("Asset updated successfully!");
            setAlertType("success");
            setIsDialogOpen(true);
            onClose();
        } else {
            console.error("Error updating asset:", response.statusText);
            const data = await response.json();
            setDialogMessage(data.errorMessage);
            setAlertType(true);
            setIsDialogOpen(true);
            setOnConfirm(() => {});
        }
    } catch (error) {
        console.error("Error updating asset:", error);
    }
};

if (!isOpen) return null;


console.log(asset);
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.closeButton} onClick={onClose}>
          X
        </div>
        <div className={styles.formContainer}>
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
            <select
              className={styles.select}
              name="type"
              value={assetData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select a type</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              name="description"
              value={assetData.description}
              onChange={handleChange}
              required
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
              required
            />
            <label className={styles.label}>Manufacturer</label>
            <input
              className={styles.input}
              type="text"
              name="manufacturer"
              value={assetData.manufacturer}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>Manufacturer Phone</label>
            <input
              className={styles.input}
              type="text"
              name="manufacturerPhone"
              value={assetData.manufacturerPhone}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>Observations</label>
            <textarea
              className={styles.textarea}
              name="observations"
              value={assetData.observations}
              onChange={handleChange}
            />
            <button type="submit" className={styles.button}>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAssetModal;
