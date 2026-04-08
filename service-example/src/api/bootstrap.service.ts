import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('🚀 Registering service...');

    try {
      const { data } = await firstValueFrom(
        this.http
          .request({
            url: '/service/register',
            method: 'post',
            headers: {
              'x-service-token': this.config.get<string>('SERVICE_TOKEN'),
            },
          })
          .pipe(timeout(3000), retry(2)),
      );

      const token = data.token;

      this.tokenService.setToken(token);

      this.logger.log('✅ Token stored successfully');
      this.listen();
    } catch (error) {
      this.logger.error('❌ Failed to register service', error?.message);
    }
  }

  async listen() {
    const token = this.authService.generateToken({ base: true });

    await firstValueFrom(
      this.http
        .request({
          url: '/admin/event/listen',
          method: 'post',
          data: {
            uid: 'mailer-new-job-listener',
            event: 'job:new',
            cbURL: `${BASE_URL}/job/new`,
            cbHeaders: { authorization: `Bearer ${token}` },
          },
        })
        .pipe(timeout(3000), retry(2)),
    );
  }
}
