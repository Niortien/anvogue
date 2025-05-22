import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post('send-email')
  async sendEmail(@Body() body: { to: string | string[], subject: string, text: string }) {
    const result = await this.notificationService.sendEmail(body.to, body.subject, body.text);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return "Email envoyé avec succès";
  }
}
