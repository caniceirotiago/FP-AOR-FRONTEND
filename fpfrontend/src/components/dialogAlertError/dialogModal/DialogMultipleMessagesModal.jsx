import React, { useEffect } from 'react';
import style from './DialogMultipleMessagesModal.module.css';
import useDialogMultipleMessagesModalStore from '../../../stores/useDialogMultipleMessagesModalStore';




const DialogMultipleMessagesModal  = () => {

    const { dialogMessage, isDialogOpen , clearDialog, dialogTitle} = useDialogMultipleMessagesModalStore();
    
    useEffect(() => {
    }   , [isDialogOpen]);

    
    const handleClose = () => {
        clearDialog();
    }

    if (!isDialogOpen) return null;
    return (
        <div className={style.modal}>
            <div className={style.modalContent}>
                <span className={style.close} >&times;</span>
                <h2>{dialogTitle}</h2>
                {dialogMessage.map((message, index) => (
                    <React.Fragment key={index}>
                        <p>{message}</p>
                        <br />
                    </React.Fragment>
                    ))}
                <div className={style.modalButtons}>
                    <button onClick={handleClose}>Ok</button>
                </div>
            </div>
        </div>
    );
}
export default DialogMultipleMessagesModal ;