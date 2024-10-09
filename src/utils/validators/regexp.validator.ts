import { ValidationOptions } from 'class-validator';

interface MatchesOptions {
  pattern: RegExp;
  validationOptions?: ValidationOptions;
}

export const emailRegExp: MatchesOptions = {
  pattern: /^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,}$/,
  validationOptions: {
    message: 'invalid email address. Please use lowercase letters, numbers and dots only.',
  },
};

export const passwordRegExp: MatchesOptions = {
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
  validationOptions: {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and must be at least 8 characters long.',
  },
};
