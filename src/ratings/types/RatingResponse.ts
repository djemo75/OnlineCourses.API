import { Rating } from 'src/typeorm/entities/Rating';

type User = {
  id: number;
  email: string;
  name: string;
  picture: string;
};

export type RatingResponse = Rating & { user: User };
