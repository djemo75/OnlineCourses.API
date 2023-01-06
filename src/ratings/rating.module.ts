import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/config.service';
import { Rating } from 'src/typeorm/entities/Rating';
import { User } from 'src/typeorm/entities/User';
import { UserRepository } from 'src/users/user.repository';
import { RatingController } from './rating.controller';
import { RatingRepository } from './rating.repository';
import { RatingService } from './rating.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User, Rating])],
  controllers: [RatingController],
  providers: [
    UserRepository,
    RatingRepository,
    RatingService,
    AppConfigService,
  ],
})
export class RatingModule {}
