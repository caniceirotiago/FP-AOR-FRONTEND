import React from "react";
import styles from "./ListUser.module.css";

const roles = ["ADMIN", "STANDARD_USER"];
const roleMapping = {
  1: "ADMIN",
  2: "STANDARD_USER",
  ADMIN: 1,
  STANDARD_USER: 2,
};

const ListUser = ({ user, handleChangeUserRole }) => {

  const onChangeRole = (event) => {
    const roleName = event.target.value;
    const roleId = roleMapping[roleName];
    handleChangeUserRole(user.id, roleId);
  };

  return (
    <div className={styles.userItem}>
      <img src={user.photo} alt="user" className={styles.photo} />
      <div className={styles.username}>{user.username}</div>
      <div className={styles.role}>
        <select value={user.role} onChange={onChangeRole}>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ListUser;
