// backend/src/core/application/ports/mailer.port.ts
export interface EmailAddress {
  name?: string;
  email: string;
}

export interface SendEmailParams {
  to: EmailAddress | EmailAddress[];
  from?: EmailAddress; // usa el sender por defecto si no se especifica
  subject: string;
  html?: string;
  text?: string;
  templateId?: string; // ID de template en SendGrid/Resend/etc.
  variables?: Record<string, unknown>; // variables del template
  replyTo?: EmailAddress;
}

export interface IMailerPort {
  send(params: SendEmailParams): Promise<void>;
  sendBulk(params: SendEmailParams[]): Promise<void>;
}

export const MAILER_PORT = Symbol('IMailerPort');
