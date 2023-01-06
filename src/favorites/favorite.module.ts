import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/config.service';
import { Favorite } from 'src/typeorm/entities/Favorite';
import { User } from 'src/typeorm/entities/User';
import { UserRepository } from 'src/users/user.repository';
import { FavoriteController } from './favorite.controller';
import { FavoriteRepository } from './favorite.repository';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User, Favorite])],
  controllers: [FavoriteController],
  providers: [
    UserRepository,
    FavoriteRepository,
    FavoriteService,
    AppConfigService,
  ],
})
export class FavoriteModule {}
