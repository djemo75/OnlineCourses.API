import { Controller, Get, Body, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { FullUserData } from './types/GetFullProfileResponse';
import { GetProfileResponse } from './types/GetProfileResponse';
import { GoogleLoginResponse } from './types/GoogleLoginResponse';
import { GoogleRefreshTokenResponse } from './types/GoogleRefreshTokenResponse';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/profile')
  getProfile(@Req() request: Request): Promise<GetProfileResponse> {
    const accessToken = (request.user as FullUserData).accessToken;

    return this.authService.getProfile(accessToken);
  }

  @Post('/google/login')
  async googleLogin(
    @Body('code') code,
    @Res({ passthrough: true }) response: Response,
  ): Promise<GoogleLoginResponse> {
    const result = await this.authService.googleLogin(code);

    response.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      domain: 'localhost',
      maxAge: 60 * 60 * 1000,
    });

    return result;
  }

  @Post('/google/refresh-token')
  async googleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<GoogleRefreshTokenResponse> {
    const email = (request.user as FullUserData).email;

    const result = await this.authService.googleRefreshToken(email);

    response.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      domain: 'localhost',
      maxAge: 60 * 60 * 1000,
    });

    return result;
  }

  @Post('/google/logout')
  async googleLogout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    response.clearCookie('accessToken');

    return true;
  }
}
