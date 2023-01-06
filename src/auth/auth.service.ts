import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/user.repository';
import { GoogleService } from './google.service';
import { GetFullProfileResponse } from './types/GetFullProfileResponse';
import { GetProfileResponse } from './types/GetProfileResponse';
import { GoogleLoginResponse } from './types/GoogleLoginResponse';
import { GoogleRefreshTokenResponse } from './types/GoogleRefreshTokenResponse';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly googleService: GoogleService,
  ) {}

  async getProfile(accessToken: string): Promise<GetProfileResponse> {
    try {
      if (!accessToken) {
        throw new BadRequestException('Access token is not provided!');
      }

      const userInfo = await this.googleService.getUserInfoByAccessToken(
        accessToken,
      );

      const user = await this.userRepository.findUserByAccessToken(accessToken);

      if (!user) {
        throw new BadRequestException("Can't find the user in database!");
      }

      return {
        userData: { ...userInfo, id: user.id, provider: user.provider },
      };
    } catch (error) {
      throw error;
    }
  }

  async getFullProfile(accessToken: string): Promise<GetFullProfileResponse> {
    try {
      if (!accessToken) {
        throw new BadRequestException('Access token is not provided!');
      }

      const userInfo = await this.googleService.getUserInfoByAccessToken(
        accessToken,
      );

      const user = await this.userRepository.findUserByAccessToken(accessToken);

      return {
        userData: { ...userInfo, ...user },
      };
    } catch (error) {
      throw error;
    }
  }

  async googleLogin(code: string): Promise<GoogleLoginResponse> {
    try {
      if (!code) {
        throw new BadRequestException('Authorization Code is not provided!');
      }

      const tokens = await this.googleService.getTokensByCode(code);

      const userInfo = await this.googleService.getUserInfoByAccessToken(
        tokens.access_token,
      );

      const existUser = await this.userRepository.findUserByEmail(
        userInfo.email,
      );
      let id = existUser.id;
      let provider = existUser.provider;
      if (!existUser) {
        const newUser = await this.userRepository.saveUser({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          provider: 'google',
        });
        id = newUser.id;
        provider = newUser.provider;
      } else {
        await this.userRepository.updateUser(userInfo.email, {
          name: userInfo.name,
          picture: userInfo.picture,
          accessToken: tokens.access_token,
        });
      }

      const ticket = await this.googleService.verifyIdToken(tokens.id_token);

      return {
        userData: { ...userInfo, id, provider },
        accessToken: tokens.access_token,
        expiresIn: ticket.getPayload().exp,
      };
    } catch (error) {
      throw error;
    }
  }

  async googleRefreshToken(email: string): Promise<GoogleRefreshTokenResponse> {
    try {
      const user = await this.userRepository.findUserByEmail(email);

      if (!user.refreshToken) {
        throw new BadRequestException('Refresh Token is not provided!');
      }

      const tokens = await this.googleService.refreshAccessToken(
        user.refreshToken,
      );

      await this.userRepository.updateUser(user.email, {
        accessToken: tokens.access_token,
      });

      const ticket = await this.googleService.verifyIdToken(tokens.id_token);

      return {
        accessToken: tokens.access_token,
        expiresIn: ticket.getPayload().exp,
      };
    } catch (error) {
      throw error;
    }
  }
}
