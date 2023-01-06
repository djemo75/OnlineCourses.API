import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating, RatingItemType } from 'src/typeorm/entities/Rating';
import { Repository } from 'typeorm';

@Injectable()
export class RatingRepository {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async findRatingById(id: number) {
    return await this.ratingRepository.findOneBy({ id });
  }

  async findRatingsByItemId(itemId: string) {
    return await this.ratingRepository.find({
      where: { itemId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findRatingByUserIdAndItemId(userId: number, itemId: string) {
    return await this.ratingRepository.findOneBy({ userId, itemId });
  }

  async findRatingsByUserId(userId: number, type?: RatingItemType) {
    return await this.ratingRepository.findBy({ userId, itemType: type });
  }

  async saveRating(rating: Rating) {
    return this.ratingRepository.save(rating);
  }

  async updateRating(id: number, data: Partial<Rating>) {
    return this.ratingRepository.update({ id }, { ...data });
  }

  async delete(favorite: Rating) {
    return this.ratingRepository.remove(favorite);
  }
}
