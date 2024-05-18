export const validatePassword = (password) => {
    const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&amp;*(),.?\":{}|&lt;&gt;])[A-Za-z\\d!@#$%^&*(),.?\":{}|<>]{8,128}$");
    return regex.test(password);
 };
