import { Exclude } from 'class-transformer';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, Matches, IsOptional, IsBoolean, IsEnum } from 'class-validator';

import { emailRegExp, passwordRegExp } from '@Validators/regexp.validator';
import { EmailTemplate } from '@Emails/enums/email.enum';

export class FetchUserDTO {
  constructor(partial: Partial<FetchUserDTO>) {
    Object.assign(this, partial);
  }

  id: string;
  email: string;

  @Exclude()
  password: string;

  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  deletedAt: Date | null;
}

export class CredentialsDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(emailRegExp.pattern, emailRegExp.validationOptions)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(passwordRegExp.pattern, passwordRegExp.validationOptions)
  password: string;

  @IsBoolean()
  rememberMe: boolean;
}

export class SignupCredentials extends OmitType(CredentialsDTO, ['rememberMe'] as const) {
  @IsOptional()
  @IsBoolean()
  receiveNotifications?: boolean;
}

export class CryptoTokenDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ForgotPasswordDTO extends PickType(CredentialsDTO, ['email'] as const) {}

export class ResetPasswordDTO extends PickType(CredentialsDTO, ['password'] as const) {}

export class ResendEmailDTO extends PickType(CredentialsDTO, ['email'] as const) {
  @IsEnum(EmailTemplate)
  template: EmailTemplate;
}
