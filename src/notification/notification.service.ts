import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class NotificationService {

  // Resend Instance
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY')!);
  }

  async sendEmail(to: string | string[], subject: string, text: string) {
    const sreceivers = typeof to === 'string' ? [to] : to;
    try {
      const data = await this.resend.emails.send({
        from: this.configService.get('SENDING_EMAIL')!,
        to: [...sreceivers, 'delivered@resend.dev'],
        subject: subject,
        html: text,
      });
      return data;

    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
