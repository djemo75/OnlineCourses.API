import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite, FavoriteItemType } from 'src/typeorm/entities/Favorite';
import { Repository } from 'typeorm';

@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async findFavoriteById(id: number) {
    return await this.favoriteRepository.findOneBy({ id });
  }

  async findFavoriteByUserIdAndItemId(userId: number, itemId: string) {
    return await this.favoriteRepository.findOneBy({ userId, itemId });
  }

  async findFavoritesByUserId(userId: number) {
    return await this.favoriteRepository.findBy({ userId });
  }

  async findFavoritesByUserIdAndItemType(
    userId: number,
    itemType: FavoriteItemType,
  ) {
    return await this.favoriteRepository.findBy({ userId, itemType });
  }

  async saveFavorite(favorite: Favorite) {
    return this.favoriteRepository.save(favorite);
  }

  async updateFavorite(id: number, data: Partial<Favorite>) {
    return this.favoriteRepository.update({ id }, { ...data });
  }

  async delete(favorite: Favorite) {
    return this.favoriteRepository.remove(favorite);
  }
}
