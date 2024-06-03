import react from 'react';
import styles from './ListItem.module.css';
import useProjectRolesStore from '../../../stores/useProjectRolesStore';

const ListItem = ({ title, attribute, creationMode, handleChangeUserProjectRole }) => {
    const { roles } = useProjectRolesStore();

    const onChangeRole = (event) => {
        const role = event.target.value;
        const userId = attribute.user.id;
        handleChangeUserProjectRole(userId, role);
      };

    return (
        <>
        {(title === "keywords") &&
        (
            <>
            <div className={styles.attributeName}>{attribute.name}</div>
            </>
        )}
        {(title === "interests" || title === "skills") &&
        (
            <>
            <div className={styles.attributeName}>{attribute.name}</div>
            <div className={styles.attributeValue}>{attribute.type}</div>
            </>
        )}
        {title === "users" &&
        (
            <>
            <div className={styles.attributePhoto}>
                <img src={attribute.user.photo} alt="user" className={styles.photo}/>
            </div>
            <div className={styles.attributeName}>{attribute.user.username}</div>
            {!creationMode && <div className={styles.attributeRole}>
                <select
                 value={attribute.role} 
                 onChange={onChangeRole}>
                    {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
                </div>}
            {!attribute.accepted && <div className={styles.attributeName}>not accepted</div>}
            </>
        )}
            
        </>
    );
    };

export default ListItem;