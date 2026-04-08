import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CommentService } from './comment.service';
import { ResendModule } from './resend/resend.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    AuthModule,
    ApiModule,
    ResendModule,
  ],
  controllers: [AppController],
  providers: [AppService, CommentService],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);
}
