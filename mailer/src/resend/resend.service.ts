import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
  }

  async sendEmail(options: any) {
    try {
      options.from ??= 'Mon App <onboarding@resend.dev>';
      const data = await this.resend.emails.send(options);

      return data;
    } catch (error) {
      throw new InternalServerErrorException("Échec de l'envoi de l'email");
    }
  }
}
