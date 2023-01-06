import { HttpModule } from '@nestjs/axios';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { AppConfigService } from 'src/config/config.service';
import { User } from 'src/typeorm/entities/User';
import { UserRepository } from 'src/users/user.repository';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';
import { GoogleService } from './google.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleService,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    AppConfigService,
    OAuth2Client,
    UserRepository,
    AuthMiddleware,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/api/health', method: RequestMethod.GET },
        { path: '/api/auth/google/login', method: RequestMethod.POST },
        { path: '/api/auth/google/logout', method: RequestMethod.POST },
        { path: '/api/ratings/statistic/:itemId', method: RequestMethod.GET },
        { path: '/api/ratings/:itemId', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
