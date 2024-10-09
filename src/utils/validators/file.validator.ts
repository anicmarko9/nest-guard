import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { MAX_FILE_SIZE, ALLOWED_FILE_EXTENSIONS, ALLOWED_MIME_TYPES } from '@Utils/constants/util.constant';

@ValidatorConstraint({ name: 'file-content-validator', async: false })
export class FileContentValidator implements ValidatorConstraintInterface {
  validate(content: string): boolean {
    const fileSizeInBytes: number =
      (content?.length * 3) / 4 - (content?.indexOf?.('=') > 0 ? content?.length - content?.indexOf?.('=') : 0);

    return fileSizeInBytes <= MAX_FILE_SIZE;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args?.property} must be a valid base64 string and must not exceed 10MB.`;
  }
}

@ValidatorConstraint({ name: 'file-name-validator', async: false })
export class FileNameValidator implements ValidatorConstraintInterface {
  validate(filename: string): boolean {
    const extension: string = filename.substring(filename.lastIndexOf('.'));

    return ALLOWED_FILE_EXTENSIONS.includes(extension.toLowerCase());
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args?.property} must have a valid file extension, such as ${ALLOWED_FILE_EXTENSIONS.join(', ')}.`;
  }
}

@ValidatorConstraint({ name: 'file-type-validator', async: false })
export class FileTypeValidator implements ValidatorConstraintInterface {
  validate(type: string): boolean {
    return ALLOWED_MIME_TYPES.includes(type.toLowerCase());
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args?.property} must be one of the valid file types: ${ALLOWED_MIME_TYPES.join(', ')}.`;
  }
}
