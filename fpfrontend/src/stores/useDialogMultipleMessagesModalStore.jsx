
import {create} from 'zustand';

/**
 * ErrorMessageModalStore (Zustand Store)
 * Manages the state of an error message modal within the application.
 * This store keeps track of whether the modal is open, the message(s) to be displayed,
 * and the title of the dialog.
 *
 * State:
 * - isDialogOpen: Boolean indicating if the dialog is currently open.
 * - dialogMessage: An array of messages to be displayed in the dialog.
 * - dialogTitle: The title of the dialog.
 *
 * Actions:
 * - setDialogTitle: Sets the title of the dialog.
 * - setIsDialogOpen: Opens or closes the dialog.
 * - setDialogMessage: Sets the messages to be displayed in the dialog.
 * - clearDialog: Resets the dialog state, including messages and title, to its initial values.
 */


const DialogMultipleMessagesModalStore = create((set) => ({
  isDialogOpen: false,
  dialogMessage: [],
  dialogTitle: '',
    setDialogMultipleMessagesTitle: (title) => set({ dialogTitle: title }),
    setIsDialogMultipleMessagesOpen: (isOpen) => set({ isDialogOpen: isOpen }),
    setDialogMultipleMessages: (dialogMessage) => set({ dialogMessage: dialogMessage }),
    clearDialog: () => set({ isDialogOpen: false, dialogMessage: [],  dialogTitle: ''}),
}));

export default DialogMultipleMessagesModalStore;
