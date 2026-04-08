import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { BootstrapService } from './bootstrap.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule,

    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get<string>('BASE_API_URL'),
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
    }),

    AuthModule,
  ],
  providers: [ApiService, TokenService, BootstrapService],
  exports: [ApiService],
})
export class ApiModule {}
