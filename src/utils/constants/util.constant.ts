import { EmailTemplate } from '@Emails/enums/email.enum';

export const frontURL: string = `${process.env.FRONT_URL}`;

export const ALLOWED_RETRY_TEMPLATES: EmailTemplate[] = [
  EmailTemplate.VERIFY_EMAIL,
  EmailTemplate.RESET_PASSWORD,
];

export const MAX_FILE_SIZE: number = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_FILE_EXTENSIONS: string[] = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.txt',
  '.pdf',
  '.doc',
  '.docx',
];
export const ALLOWED_MIME_TYPES: string[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'text/plain',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
