import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtAuthGuard } from './auth/jwt.guard';

@Controller()
export class AppController {
  constructor(private emitter: EventEmitter2) {}

  @Post('/job/new')
  @UseGuards(JwtAuthGuard)
  onNewComment(@Body() body: any) {
    this.emitter.emit('job:new', body);
  }
}
