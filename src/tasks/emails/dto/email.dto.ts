import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateNested,
  IsEnum,
  ArrayMaxSize,
  Matches,
  IsBase64,
  Validate,
} from 'class-validator';

import { EmailTemplate } from '@Emails/enums/email.enum';
import { emailRegExp } from '@Validators/regexp.validator';
import { FileContentValidator, FileNameValidator, FileTypeValidator } from '@Validators/file.validator';

export class EmailDataDTO {
  @IsEnum(EmailTemplate)
  template: EmailTemplate;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Matches(emailRegExp.pattern, { ...emailRegExp.validationOptions, each: true })
  to: string[];
}

export class EmailAttachmentDTO {
  @IsString()
  @IsNotEmpty()
  @IsBase64()
  @Validate(FileContentValidator)
  content: string;

  @IsString()
  @IsNotEmpty()
  @Validate(FileNameValidator)
  filename: string;

  @IsString()
  @IsNotEmpty()
  @Validate(FileTypeValidator)
  type: string;
}

export class SendEmailDTO {
  @ValidateNested()
  @Type(() => EmailDataDTO)
  data: EmailDataDTO;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => EmailAttachmentDTO)
  attachments?: EmailAttachmentDTO[];
}
