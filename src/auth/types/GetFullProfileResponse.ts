import { User } from 'src/typeorm/entities/User';
import { GetUserInfoResponse } from './GetUserInfoResponse';

export type FullUserData = GetUserInfoResponse & User;

export type GetFullProfileResponse = {
  userData: FullUserData;
};
