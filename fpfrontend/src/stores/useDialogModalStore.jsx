import {create} from 'zustand';

/**
 * DialogBoxStore (Zustand Store)
 * Manages the state and behavior of dialog boxes throughout the application. 
 * Allows for the configuration of dialog visibility, message content, and confirm action handling.
 *
 * State:
 * - isDialogOpen: Boolean flag to control the visibility of the dialog box.
 * - dialogMessage: The message content to be displayed within the dialog box.
 * - userConfirmed: Tracks if the user has confirmed the action prompted by the dialog.
 * - onConfirm: A callback function to be executed when the user confirms the dialog action.
 *
 * Actions:
 * - setIsDialogOpen: Sets the visibility of the dialog box.
 * - setDialogMessage: Updates the message content of the dialog box.
 * - setOnConfirm: Registers a callback function for when the dialog action is confirmed.
 * - clearDialog: Resets the dialog state to its initial values.
 */


const DialogBoxStore = create((set, get) => ({
  isDialogOpen: false,
  dialogMessage: '',
  userConfirmed: false,
  onConfirm: null,
  isAlertType: false,
    setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setDialogMessage: (message) => set({ dialogMessage: message }),
    setOnConfirm: (callback) => set(() => ({ onConfirm: callback })), 
    setAlertType: (isAlert) => set({isAlertType: isAlert}),
    clearDialog: () => set({ isDialogOpen: false, dialogMessage: '', userConfirmed: false, isAlertType: false}),
}));

export default DialogBoxStore;
