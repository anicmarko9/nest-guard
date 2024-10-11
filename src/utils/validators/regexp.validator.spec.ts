import { emailRegExp, passwordRegExp } from './regexp.validator';

describe('Regular Expressions', (): void => {
  describe('emailRegExp', (): void => {
    it('should match valid email addresses', (): void => {
      const validEmails: string[] = [
        'test@example.com',
        'user.name@domain.co',
        'firstname.lastname@sub.domain.com',
      ];

      validEmails.forEach((email: string): void => {
        expect(emailRegExp.pattern.test(email)).toBe(true);
      });
    });

    it('should not match invalid email addresses', (): void => {
      const invalidEmails: string[] = [
        'test@example',
        'user@.com',
        '1@example.com',
        '@gmail.com',
        'user@domain..com',
        'USER@DOMAIN.COM',
      ];

      invalidEmails.forEach((email: string): void => {
        expect(emailRegExp.pattern.test(email)).toBe(false);
      });
    });
  });

  describe('passwordRegExp', (): void => {
    it('should match valid passwords', (): void => {
      const validPasswords: string[] = ['Password1!', 'Strong@Pass2', 'Valid1#Password'];

      validPasswords.forEach((password: string): void => {
        expect(passwordRegExp.pattern.test(password)).toBe(true);
      });
    });

    it('should not match invalid passwords', (): void => {
      const invalidPasswords: string[] = [
        'password', // only lowercase
        'PASSWORD', // only uppercase
        '12345678', // only numbers
        'Pass1234', // no symbol
        'Password!', // no number
        'P@ssw', // short
      ];

      invalidPasswords.forEach((password: string): void => {
        expect(passwordRegExp.pattern.test(password)).toBe(false);
      });
    });
  });
});
