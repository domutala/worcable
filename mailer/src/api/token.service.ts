import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  private token: string | null = null;

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clear(): void {
    this.token = null;
  }
}
