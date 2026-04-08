import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  @OnEvent('job:new')
  onNewJob(event: any) {
    // code here
  }
}
