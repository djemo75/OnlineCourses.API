import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './typeorm/entities/User';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AppConfigModule } from './config/config.module';
import { Favorite } from './typeorm/entities/Favorite';
import { FavoriteModule } from './favorites/favorite.module';
import { Rating } from './typeorm/entities/Rating';
import { RatingModule } from './ratings/rating.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    FavoriteModule,
    RatingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('app.dbHost'),
        port: configService.get('app.dbPort') || 3306,
        username: configService.get('app.dbUsername'),
        password: configService.get('app.dbPassword'),
        database: configService.get('app.dbName'),
        entities: [User, Favorite, Rating],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
