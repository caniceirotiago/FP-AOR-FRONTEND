import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styles from "./UserRoleEditor.module.css";
import ListUser from "./listItems/ListUser.jsx";
import userService from "../../services/userService.jsx";
import useDialogModalStore from "../../stores/useDialogModalStore.jsx";

const roleMapping = {
  1: "ADMIN",
  2: "STANDARD_USER",
  ADMIN: 1,
  STANDARD_USER: 2,
};

const UserRoleEditor = () => {
  const [users, setUsers] = useState([]);
  const intl = useIntl();
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.fetchUsersListBasicInfo();
        if (response.status === 200) {
          const data = await response.json();
          // Convert role IDs to role names
          const usersWithRoles = data.map((user) => ({
            ...user,
            role: roleMapping[user.role],
          }));
          setUsers(usersWithRoles);
        } else {
          console.log("Error loading users list basic info");
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleChangeUserRole = async (userId, roleId) => {
    const updateUserRoleDto = {
      userId: userId,
      roleId: roleId,
    };
    try {
      const response = await userService.updateUserRole(updateUserRoleDto);
      if (response.status === 204) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: roleMapping[roleId] } : user
          )
        );
        setDialogMessage(
          intl.formatMessage({
            id: "userRoleSuccess",
            defaultMessage: "User role updated successfully",
          })
        );
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {});
      } else {
        setDialogMessage(
          intl.formatMessage({
            id: "userRoleFailure",
            defaultMessage: "Failed to update user role",
          })
        );
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {});
        throw new Error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>
        <FormattedMessage
          id="userManagementTitle"
          defaultMessage="User Management"
        />
      </h2>
      <div className={styles.userListContainer}>
        <ul className={styles.userList}>
          {users.map((user) => (
            <li className={styles.user} key={user.id}>
              <ListUser
                user={user}
                handleChangeUserRole={handleChangeUserRole}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserRoleEditor;
