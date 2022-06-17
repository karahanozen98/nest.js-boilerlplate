import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT } from 'constant';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === ENVIRONMENT.development;
  }

  get isQA(): boolean {
    return this.nodeEnv === ENVIRONMENT.qa;
  }

  get isProduction(): boolean {
    return this.nodeEnv === ENVIRONMENT.production;
  }

  get isTest(): boolean {
    return this.nodeEnv === ENVIRONMENT.test;
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANG');
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get apiConfig() {
    return {
      port: this.getNumber('PORT'),
      baseUrl: this.getString('BACKEND_URL'),
      publicCacheUrl: this.getString('PUBLIC_CACHE'),
      sessionCacheUrl: this.getString('SESSION_CACHE'),
    };
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(key + ' environment variable does not set');
    }
    return value;
  }
}
