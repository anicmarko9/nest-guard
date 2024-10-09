import { EmailTemplate } from '@Emails/enums/email.enum';

export interface SendEmailParams {
  data: EmailBodyParams;
  attachments?: EmailAttachment[];
}

export interface EmailBodyParams {
  template: EmailTemplate;
  to: string[];
  url?: string;
  companyName?: string;
  companyOwnerName?: string;
}

export interface EmailAttachment {
  content: string;
  filename: string;
  type: string;
}
