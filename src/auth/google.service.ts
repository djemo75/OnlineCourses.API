import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { GetTokensResponse } from './types/GetTokensResponse';
import { GetUserInfoResponse } from './types/GetUserInfoResponse';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class GoogleService {
  constructor(
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private client: OAuth2Client,
  ) {
    const { googleClientId } = this.appConfigService;
    this.client = new OAuth2Client(googleClientId);
  }

  async getTokensByCode(code: string): Promise<GetTokensResponse> {
    const {
      googleAuthApi,
      googleClientId,
      googleClientSecret,
      googleAuthRedirectUrl,
    } = this.appConfigService;
    const url = `${googleAuthApi}/token?grant_type=authorization_code&code=${code}&client_id=${googleClientId}&client_secret=${googleClientSecret}&redirect_uri=${googleAuthRedirectUrl}`;
    try {
      const res = await this.httpService.axiosRef.post(url);

      return res.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<GetTokensResponse> {
    const {
      googleAuthApi,
      googleClientId,
      googleClientSecret,
      googleAuthRedirectUrl,
    } = this.appConfigService;
    const url = `${googleAuthApi}/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${googleClientId}&client_secret=${googleClientSecret}&redirect_uri=${googleAuthRedirectUrl}`;

    try {
      const res = await this.httpService.axiosRef.post(url);

      return res.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getUserInfoByAccessToken(
    accessToken: string,
  ): Promise<GetUserInfoResponse> {
    const url = `${this.appConfigService.googleAuthApi}/userinfo`;

    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const res = await this.httpService.axiosRef.post(url, {}, { headers });

      return res.data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async verifyIdToken(idToken: string): Promise<LoginTicket> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
      });

      return ticket;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  // Additional endpoint: Check access_token expiration
  // https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=1/fFBGRNJru1FQd44AzqT3Zg
}
