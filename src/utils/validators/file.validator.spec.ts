import { FileContentValidator, FileNameValidator, FileTypeValidator } from './file.validator';
import { MAX_FILE_SIZE } from '@Constants/util.constant';

describe('FileContentValidator', (): void => {
  let validator: FileContentValidator;

  beforeEach((): void => {
    validator = new FileContentValidator();
  });

  it('should return true for valid base64 content under max size', (): void => {
    const validBase64: string =

    expect(validator.validate(validBase64)).toBe(true);
  });

  it('should return false for base64 content exceeding max size', (): void => {
    const oversizedBase64Size: number = MAX_FILE_SIZE + 1;

    const oversizedBase64Length: number = Math.ceil((oversizedBase64Size * 4) / 3);
    const oversizedBase64: string = 'A'.repeat(oversizedBase64Length);

    expect(validator.validate(oversizedBase64)).toBe(false);
  });
});

describe('FileNameValidator', (): void => {
  let validator: FileNameValidator;

  beforeEach((): void => {
    validator = new FileNameValidator();
  });

  it('should return true for valid filenames', (): void => {
    const validFilenames: string[] = ['image.jpg', 'document.pdf', 'file.txt', 'photo.png'];

    validFilenames.forEach((filename: string): void => {
      expect(validator.validate(filename)).toBe(true);
    });
  });

  it('should return false for invalid filenames', (): void => {
    const invalidFilenames: string[] = ['image.bmp', 'archive.zip', 'text'];

    invalidFilenames.forEach((filename: string): void => {
      expect(validator.validate(filename)).toBe(false);
    });
  });
});

describe('FileTypeValidator', (): void => {
  let validator: FileTypeValidator;

  beforeEach((): void => {
    validator = new FileTypeValidator();
  });

  it('should return true for valid MIME types', (): void => {
    const validMimeTypes: string[] = ['image/jpeg', 'image/png', 'text/plain', 'application/pdf'];

    validMimeTypes.forEach((mimeType: string): void => {
      expect(validator.validate(mimeType)).toBe(true);
    });
  });

  it('should return false for invalid MIME types', (): void => {
    const invalidMimeTypes: string[] = ['image/bmp', 'application/zip', 'text/html'];

    invalidMimeTypes.forEach((mimeType: string): void => {
      expect(validator.validate(mimeType)).toBe(false);
    });
  });
});