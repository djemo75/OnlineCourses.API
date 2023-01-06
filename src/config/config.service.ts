import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('app.appEnv') || 'development';
  }
  get port(): number {
    return Number(this.configService.get<number>('app.appPort')) || 3001;
  }
  get dbHost(): string {
    return this.configService.get<string>('app.dbHost') || '';
  }
  get dbPort(): number {
    return Number(this.configService.get<number>('app.dbPort')) || 3306;
  }
  get dbUsername(): string {
    return this.configService.get<string>('app.dbUsername') || '';
  }
  get dbPassword(): string {
    return this.configService.get<string>('app.dbPassword') || '';
  }
  get dbName(): string {
    return this.configService.get<string>('app.dbName') || '';
  }
  get googleAuthApi(): string {
    return this.configService.get<string>('app.googleAuthApi') || '';
  }
  get googleClientId(): string {
    return this.configService.get<string>('app.googleClientId') || '';
  }
  get googleClientSecret(): string {
    return this.configService.get<string>('app.googleClientSecret') || '';
  }
  get googleAuthRedirectUrl(): string {
    return this.configService.get<string>('app.googleAuthRedirectUrl') || '';
  }
  get authenticationToken(): string {
    return this.configService.get<string>('app.authenticationToken') || '';
  }
}
