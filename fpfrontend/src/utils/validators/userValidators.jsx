import PasswordValidator from 'password-validator';
import zxcvbn from 'zxcvbn';

const schema = new PasswordValidator();
schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().symbols()
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

const validatePassword = (password) => {
    const validationErrors = schema.validate(password, { list: true });
    const result = zxcvbn(password);

    const errors = validationErrors.map(error => {
        switch (error) {
            case 'min':
                return 'Password must be at least 8 characters long.';
            case 'uppercase':
                return 'Password must include an uppercase letter.';
            case 'lowercase':
                return 'Password must include a lowercase letter.';
            case 'digits':
                return 'Password must include at least one digit.';
            case 'symbols':
                return 'Password must include a special character.';
            case 'spaces':
                return 'Password should not contain spaces.';
            default:
                return 'Password does not meet the required criteria.';
        }
    });

    if (result.score < 2) {
        errors.push('Password is too weak.');
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
        score: result.score
    };
};

export { validatePassword };
