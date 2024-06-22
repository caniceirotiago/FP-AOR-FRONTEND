import React, { useState, useEffect } from "react";
import assetService from "../../../services/assetService";
import styles from "./EditAssetModal.module.css";
import { FormattedMessage, useIntl } from "react-intl";
import "react-datepicker/dist/react-datepicker.css";
import useDialogModalStore from "../../../stores/useDialogModalStore.jsx";
import useAssetsStore from "../../../stores/useAssetsStore.jsx";

const EditAssetModal = ({ isOpen, onClose, selectedAssetId, isViewOnly }) => {
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();
  const [assetData, setAssetData] = useState(null);
  const { types } = useAssetsStore();
  const intl = useIntl();

  useEffect(() => {
    if (!selectedAssetId) return;

    const fetchAssetById = async () => {
      try {
        const response = await assetService.getAssetById(selectedAssetId);
        if (response.status === 200) {
          const data = await response.json();
          setAssetData(data);
        } else {
          console.error("Error fetching asset:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching asset:", error.message);
      }
    };
    fetchAssetById();
  }, [selectedAssetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData({
      ...assetData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewOnly) {
      onClose();
      return;
    }
    try {
      const response = await assetService.updateAsset(assetData);
      if (response.ok) {
        setDialogMessage(intl.formatMessage({ id: "assetUpdatedSuccess", defaultMessage: "Asset updated successfully!" }));
        setAlertType("success");
        setIsDialogOpen(true);
        setOnConfirm(() => {
          onClose();
          setIsDialogOpen(false);
        });
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

  if (!isOpen || !assetData) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.closeButton} onClick={onClose}>
          X
        </div>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
              <FormattedMessage id="assetName" defaultMessage="Asset Name" />
            </label>
            <input
              className={styles.input}
              type="text"
              name="name"
              value={assetData.name}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            />
            <label className={styles.label}>
              <FormattedMessage id="type" defaultMessage="Type" />
            </label>
            <select
              className={styles.select}
              name="type"
              value={assetData.type}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            >
                <option value="">
                <FormattedMessage id="selectType" defaultMessage="Select type" />
              </option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label className={styles.label}>
              <FormattedMessage id="description" defaultMessage="Description" />
            </label>
            <textarea
              className={styles.textarea}
              name="description"
              value={assetData.description}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            />
            <label className={styles.label}>
              <FormattedMessage id="stockQuantity" defaultMessage="Stock Quantity" />
            </label>
            <input
              className={styles.input}
              type="number"
              name="stockQuantity"
              value={assetData.stockQuantity}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            />
            <label className={styles.label}>
              <FormattedMessage id="partNumber" defaultMessage="Part Number" />
            </label>
            <input
              className={styles.input}
              type="text"
              name="partNumber"
              value={assetData.partNumber}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            />
             <label className={styles.label}>
              <FormattedMessage id="manufacturer" defaultMessage="Manufacturer" />
            </label>
            <input
              className={styles.input}
              type="text"
              name="manufacturer"
              value={assetData.manufacturer}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            />
             <label className={styles.label}>
              <FormattedMessage id="manufacturerPhone" defaultMessage="Manufacturer Phone" />
            </label>
            <input
              className={styles.input}
              type="text"
              name="manufacturerPhone"
              value={assetData.manufacturerPhone}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            />
            <label className={styles.label}>
              <FormattedMessage id="observations" defaultMessage="Observations" />
            </label>
            <textarea
              className={styles.textarea}
              name="observations"
              value={assetData.observations}
              onChange={handleChange}
              disabled={isViewOnly}
            />
             <button type="submit" className={styles.button}>
              {isViewOnly ? <FormattedMessage id="back" defaultMessage="Back" /> : <FormattedMessage id="saveFields" defaultMessage="Save" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAssetModal;
