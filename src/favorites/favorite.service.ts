import { BadRequestException, Injectable } from '@nestjs/common';
import { Favorite, FavoriteItemType } from 'src/typeorm/entities/Favorite';
import { UserRepository } from 'src/users/user.repository';
import { FavoriteRepository } from './favorite.repository';
import { CreateFavoriteDto } from './types/CreateFavoriteDto';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly favoriteRepository: FavoriteRepository,
  ) {}

  async getFavoritesByItemType(
    userId: number,
    itemType: FavoriteItemType,
  ): Promise<Favorite[]> {
    try {
      const result =
        await this.favoriteRepository.findFavoritesByUserIdAndItemType(
          userId,
          itemType,
        );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getFavoritesByItemIds(
    userId: number,
    itemIds: string[],
  ): Promise<Favorite[]> {
    try {
      const result = await Promise.all(
        itemIds.map(async (itemId) => {
          return this.favoriteRepository.findFavoriteByUserIdAndItemId(
            userId,
            itemId,
          );
        }),
      );

      return result.filter((item) => item);
    } catch (error) {
      throw error;
    }
  }

  async addFavorite(
    userId: number,
    payload: CreateFavoriteDto,
  ): Promise<Favorite> {
    try {
      const user = await this.userRepository.findUserById(userId);

      const existingFavorite =
        await this.favoriteRepository.findFavoriteByUserIdAndItemId(
          user.id,
          payload.itemId,
        );

      if (existingFavorite) {
        throw new BadRequestException(
          'You have already added this to your favorites list!',
        );
      }

      const newFavorite = new Favorite();
      newFavorite.userId = user.id;
      newFavorite.itemId = payload.itemId;
      newFavorite.itemType = payload.itemType;

      const favorite = await this.favoriteRepository.saveFavorite(newFavorite);

      return favorite;
    } catch (error) {
      throw error;
    }
  }

  async removeFavorite(userId: number, itemId: string): Promise<any> {
    try {
      const user = await this.userRepository.findUserById(userId);

      if (!itemId) {
        throw new BadRequestException('ItemId is not provided!');
      }

      const existingFavorite =
        await this.favoriteRepository.findFavoriteByUserIdAndItemId(
          user.id,
          itemId,
        );

      if (!existingFavorite) {
        throw new BadRequestException(
          'There is no such entry in the favorites list!',
        );
      }

      const res = await this.favoriteRepository.delete(existingFavorite);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
