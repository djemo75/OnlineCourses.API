import { BadRequestException, Injectable } from '@nestjs/common';
import { Rating, RatingValue } from 'src/typeorm/entities/Rating';
import { UserRepository } from 'src/users/user.repository';
import { RatingRepository } from './rating.repository';
import { CreateRatingDto } from './types/CreateRatingDto';
import { RatingResponse } from './types/RatingResponse';
import { RatingStatistic } from './types/RatingStatistic';

@Injectable()
export class RatingService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ratingRepository: RatingRepository,
  ) {}

  async getStatisticByItemId(itemId: string): Promise<RatingStatistic> {
    try {
      const data = await this.ratingRepository.findRatingsByItemId(itemId);

      const filterByValue = (data: Rating[], value: RatingValue) => {
        return data.filter((row) => row.value === value);
      };

      const total = data.length;
      const onePercentage =
        (filterByValue(data, RatingValue.ONE).length / total) * 100 || 0;
      const twoPercentage =
        (filterByValue(data, RatingValue.TWO).length / total) * 100 || 0;
      const threePercentage =
        (filterByValue(data, RatingValue.THREE).length / total) * 100 || 0;
      const fourPercentage =
        (filterByValue(data, RatingValue.FOUR).length / total) * 100 || 0;
      const fivePercentage =
        (filterByValue(data, RatingValue.FIVE).length / total) * 100 || 0;

      const averageRating = total
        ? data.map(({ value }) => value).reduce((a, b) => a + b, 0) /
          data.length
        : 0;

      const result: RatingStatistic = {
        onePercentage,
        twoPercentage,
        threePercentage,
        fourPercentage,
        fivePercentage,
        total,
        averageRating,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getRatingsByItemId(itemId: string): Promise<RatingResponse[]> {
    try {
      const data = await this.ratingRepository.findRatingsByItemId(itemId);
      const result = await Promise.all(
        data.map(async (rating) => {
          const user = await this.userRepository.findUserById(rating.userId);
          const response: RatingResponse = {
            ...rating,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              picture: user.picture,
            },
          };

          return response;
        }),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async addRating(
    userId: number,
    createRatingDto: CreateRatingDto,
  ): Promise<any> {
    try {
      const user = await this.userRepository.findUserById(userId);

      const existingRating =
        await this.ratingRepository.findRatingByUserIdAndItemId(
          user.id,
          createRatingDto.itemId,
        );

      if (existingRating) {
        throw new BadRequestException(
          'You have already added this to rating list!',
        );
      }

      const newRating = new Rating();
      newRating.userId = user.id;
      newRating.itemType = createRatingDto.itemType;
      newRating.itemId = createRatingDto.itemId;
      newRating.value = createRatingDto.value;
      newRating.comment = createRatingDto.comment;

      const rating = await this.ratingRepository.saveRating(newRating);

      return rating;
    } catch (error) {
      throw error;
    }
  }

  async removeRating(userId: number, itemId: string): Promise<Rating> {
    try {
      const user = await this.userRepository.findUserById(userId);

      if (!itemId) {
        throw new BadRequestException('ItemId is not provided!');
      }

      const existingRating =
        await this.ratingRepository.findRatingByUserIdAndItemId(
          user.id,
          itemId,
        );

      if (!existingRating) {
        throw new BadRequestException(
          'There is no such entry in the rating list!',
        );
      }

      const res = await this.ratingRepository.delete(existingRating);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
