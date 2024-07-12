import PasswordValidator from "password-validator";
import zxcvbn from "zxcvbn";

// Create a new instance of PasswordValidator
const schema = new PasswordValidator();

// Define password validation rules using PasswordValidator API
schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(1)
  .has()
  .symbols()
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

// Function to validate a password based on defined schema and zxcvbn strength estimation
const validatePassword = (password) => {
  // Validate password against defined schema and get validation errors
  const validationErrors = schema.validate(password, { list: true });
  // Use zxcvbn to estimate password strength
  const result = zxcvbn(password);

  // Map validation errors to descriptive error messages
  const errors = validationErrors.map((error) => {
    switch (error) {
      case "min":
        return "Password must be at least 8 characters long.";
      case "uppercase":
        return "Password must include an uppercase letter.";
      case "lowercase":
        return "Password must include a lowercase letter.";
      case "digits":
        return "Password must include at least one digit.";
      case "symbols":
        return "Password must include a special character.";
      case "spaces":
        return "Password should not contain spaces.";
      default:
        return "Password does not meet the required criteria.";
    }
  });

  // If zxcvbn score is less than 2 (indicating weak password), add a "Password is too weak." error
  if (result.score < 2) {
    errors.push("Password is too weak.");
  }

  // Return validation result object containing validity status, errors, and zxcvbn score
  return {
    isValid: errors.length === 0, // Password is valid if there are no errors
    errors: errors, // Array of error messages describing validation issues
    score: result.score, // Strength score from zxcvbn (0 to 4)
  };
};

export { validatePassword };
