import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RatingItemType {
  COURSE = 'course',
  COURSE_LESSON = 'courseLesson',
}

export enum RatingValue {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

@Entity({ name: 'ratings' })
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: RatingItemType,
  })
  itemType: string;

  @Column()
  itemId: string;

  @Column({
    type: 'enum',
    enum: RatingValue,
  })
  value: number;

  @Column()
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
