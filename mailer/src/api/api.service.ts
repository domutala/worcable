import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TokenService } from './token.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly http: HttpService,
    private readonly tokenService: TokenService,
  ) {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.http.axiosRef.interceptors.request.use((config) => {
      const token = this.tokenService.getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  }

  getHttp() {
    return this.http;
  }
}
