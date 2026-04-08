import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ResendService } from './resend/resend.service';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(private readonly resendService: ResendService) {}

  @OnEvent('job:new')
  async onNewJob(event: any) {
    console.log(event);

    return await this.resendService.sendEmail({
      to: 'ibntalla@gmail.com',
      subject: 'Bienvenue sur notre plateforme !',
      html: '<strong>Ravi de vous voir parmi nous.</strong>',
    });
  }
}
