import {
  Controller,
  Body,
  Post,
  Delete,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { FullUserData } from 'src/auth/types/GetFullProfileResponse';
import { Rating } from 'src/typeorm/entities/Rating';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './types/CreateRatingDto';
import { RatingResponse } from './types/RatingResponse';
import { RatingStatistic } from './types/RatingStatistic';

@Controller('ratings')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Get('/statistic/:itemId')
  async getStatisticByItemId(
    @Param() param: { itemId: string },
  ): Promise<RatingStatistic> {
    return await this.ratingService.getStatisticByItemId(param.itemId);
  }

  @Get('/:itemId')
  async getRatingsByItemId(
    @Param() param: { itemId: string },
  ): Promise<RatingResponse[]> {
    return await this.ratingService.getRatingsByItemId(param.itemId);
  }

  @Post('/')
  addRating(
    @Body() createRatingDto: CreateRatingDto,
    @Req() request: Request,
  ): Promise<any> {
    const user = request.user as FullUserData;

    return this.ratingService.addRating(user.id, createRatingDto);
  }

  @Delete('/:itemId')
  removeRating(
    @Param() param: { itemId: string },
    @Req() request: Request,
  ): Promise<Rating> {
    const user = request.user as FullUserData;

    return this.ratingService.removeRating(user.id, param.itemId);
  }
}
