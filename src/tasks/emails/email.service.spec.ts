import { InternalServerErrorException, NotImplementedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import * as sg from '@sendgrid/mail';

import { EmailService } from './email.service';
import { EmailTemplate } from './enums/email.enum';

jest.mock('@sendgrid/mail');

describe('EmailService', (): void => {
  let service: EmailService;
  let configService: ConfigService;

  const mockMoveToCompleted = jest.fn();
  const mockMoveToFailed = jest.fn();

  const job = {
    data: {
      data: { to: ['user@example.com'], template: EmailTemplate.WELCOME },
      attachments: [],
    },

    moveToCompleted: mockMoveToCompleted,
    moveToFailed: mockMoveToFailed,
  } as unknown as Job;

  const mockConfigService = {
    get: jest.fn((key: string): string => {
      const configMap: Record<string, string> = {
        SENDGRID_KEY: 'test-key',
        SENDGRID_FROM: 'test@example.com',
        SENDGRID_NAME: 'Test Sender',
        SENDGRID_VERIFY_EMAIL: 'verify-template-id',
        SENDGRID_WELCOME: 'welcome-template-id',
        SENDGRID_RESET_PASSWORD: 'reset-template-id',
        SENDGRID_INVITE: 'invite-template-id',
      };

      return configMap[key];
    }),
  };

  const mockSendGrid = sg.send as jest.Mock;

  beforeAll(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', (): void => {
    expect(service).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should send email successfully', async (): Promise<void> => {
    mockSendGrid.mockResolvedValueOnce(undefined);

    await service['send'](job);

    expect(mockSendGrid).toHaveBeenCalledWith(
      expect.objectContaining({ to: ['user@example.com'], templateId: 'welcome-template-id' }),
    );
    expect(job.moveToCompleted).toHaveBeenCalledWith('completed', true);
  });

  it('should handle SendGrid error', async (): Promise<void> => {
    const error = new Error('Something went wrong while sending an email with SendGrid.');
    mockSendGrid.mockRejectedValueOnce(error);

    await expect(service['send'](job)).rejects.toThrow(InternalServerErrorException);

    expect(job.moveToFailed).toHaveBeenCalledWith({ message: error.message }, true);
    expect(mockSendGrid).toHaveBeenCalled();
  });

  it('should throw NotImplementedException for unknown template', (): void => {
    expect((): string => service['setTemplate']('UNKNOWN_TEMPLATE' as EmailTemplate)).toThrow(
      NotImplementedException,
    );
  });
});
