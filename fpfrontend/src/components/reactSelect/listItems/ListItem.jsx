import React from "react";
import styles from "./ListItem.module.css";
import useProjectRolesStore from "../../../stores/useProjectRolesStore";
import { FaTimes } from "react-icons/fa";

const ListItem = ({
  title,
  attribute,
  creationMode,
  handleChangeUserProjectRole,
  editMode,
  createdBy,
  removeItem,
}) => {
  const { roles } = useProjectRolesStore();

  const onChangeRole = (event) => {
    const role = event.target.value;
    const userId = attribute.user.id;
    handleChangeUserProjectRole(userId, role);
  };

  let isTheCreator;
  if (title === "users" && createdBy)
    isTheCreator = createdBy.username === attribute.user.username;

  return (
    <>
      {title === "keywords" && (
        <>
          <div className={styles.attributeName}>{attribute.name}</div>
        </>
      )}
      {(title === "interests" || title === "skills") && (
        <>
          <div className={styles.attributeName}>{attribute.name}</div>
          <div className={styles.attributeValue}>{attribute.type}</div>
        </>
      )}
      {title === "assets" && (
        <>
          <div className={styles.attributeName}>{attribute.name}</div>
          <div className={styles.attributeValue}>{attribute.usedQuantity}</div>
        </>
      )}
      {title === "users" && (
        <>
          <div className={styles.attributePhoto}>
            <img
              src={attribute.user.photo}
              alt="user"
              className={styles.photo}
            />
          </div>
          <div className={styles.attributeName}>{attribute.user.username}</div>
          {!creationMode && (
            <div className={styles.attributeRole}>
              <select
                value={attribute.role}
                onChange={onChangeRole}
                disabled={!editMode || isTheCreator}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          )}
          {!attribute.accepted && (
            <div className={styles.attributeName}>not accepted</div>
          )}
        </>
      )}
      {(title === "Responsible user" || title === "Registered executers") && (
        <>
          <div className={styles.attributePhoto}>
            <img src={attribute.photo} alt="user" className={styles.photo} />
          </div>
          <div className={styles.attributeName}>{attribute.username}</div>
        </>
      )}

      {editMode && !isTheCreator && (
        <div
          className={styles.removeButton}
          onClick={() => removeItem(attribute)}
        >
          <FaTimes />
        </div>
      )}
    </>
  );
};

export default ListItem;
