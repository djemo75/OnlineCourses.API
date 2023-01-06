import { GetUserInfoResponse } from './GetUserInfoResponse';

export type UserData = {
  id: number;
  provider: string;
} & GetUserInfoResponse;

export type GetProfileResponse = {
  userData: UserData;
};
