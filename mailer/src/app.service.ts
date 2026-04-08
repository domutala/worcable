import { Injectable } from '@nestjs/common';
import { ApiService } from './api/api.service';

@Injectable()
export class AppService {
  constructor(private readonly api: ApiService) {}
}
