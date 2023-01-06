import { UserData } from './GetProfileResponse';

export type GoogleLoginResponse = {
  accessToken: string;
  expiresIn: number;
  userData: UserData;
};
