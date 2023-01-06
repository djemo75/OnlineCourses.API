import { IsEnum, IsNotEmpty } from 'class-validator';
import { RatingItemType, RatingValue } from 'src/typeorm/entities/Rating';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsEnum(RatingItemType)
  itemType: RatingItemType;

  @IsNotEmpty()
  itemId: string;

  @IsNotEmpty()
  @IsEnum(RatingValue)
  value: number;

  @IsNotEmpty()
  comment: string;
}
