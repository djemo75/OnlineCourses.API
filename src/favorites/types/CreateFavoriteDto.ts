import { IsEnum, IsNotEmpty } from 'class-validator';
import { FavoriteItemType } from 'src/typeorm/entities/Favorite';

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsEnum(FavoriteItemType)
  itemType: FavoriteItemType;

  @IsNotEmpty()
  itemId: string;
}
