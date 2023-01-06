import {
  Controller,
  Body,
  Post,
  Delete,
  Req,
  Param,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { FullUserData } from 'src/auth/types/GetFullProfileResponse';
import { Favorite, FavoriteItemType } from 'src/typeorm/entities/Favorite';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './types/CreateFavoriteDto';

@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get('/:itemType')
  async getFavoritesByItemType(
    @Param() param: { itemType: FavoriteItemType },
    @Req() request: Request,
  ): Promise<Favorite[]> {
    const user = request.user as FullUserData;

    return await this.favoriteService.getFavoritesByItemType(
      user.id,
      param.itemType,
    );
  }

  @Post('/allByItemIds')
  async getFavoritesByItemIds(
    @Body('itemIds') itemIds,
    @Req() request: Request,
  ): Promise<Favorite[]> {
    const user = request.user as FullUserData;

    return await this.favoriteService.getFavoritesByItemIds(user.id, itemIds);
  }

  @Post('/')
  addFavorite(
    @Body() payload: CreateFavoriteDto,
    @Req() request: Request,
  ): Promise<Favorite> {
    const user = request.user as FullUserData;

    return this.favoriteService.addFavorite(user.id, payload);
  }

  @Delete('/:itemId')
  removeFavorite(
    @Param() param: { itemId: string },
    @Req() request: Request,
  ): Promise<Favorite> {
    const user = request.user as FullUserData;

    return this.favoriteService.removeFavorite(user.id, param.itemId);
  }
}
