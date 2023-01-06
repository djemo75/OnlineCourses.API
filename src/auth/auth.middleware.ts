import {
  Injectable,
  NestMiddleware,
  Req,
  Res,
  Next,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ): Promise<void> {
    const authError = 'Missing / Invalid Authorization Token';
    try {
      const token: string | null =
        this.extractTokenFromCookies(req.cookies) ||
        this.extractTokenFromHeader(req.headers);
      if (!token) {
        throw authError;
      }
      if (token) {
        const response = await this.authService.getFullProfile(token);

        if (!response) {
          throw authError;
        } else {
          req.user = response.userData;
          return next();
        }
      }
    } catch (error) {
      throw new UnauthorizedException(authError);
    }
  }

  private extractTokenFromHeader(headers: IncomingHttpHeaders) {
    if (!headers.authorization) {
      return null;
    }

    const [type, token] = headers.authorization.split(' ');

    if (type === 'Bearer') {
      return token;
    }
    return null;
  }

  private extractTokenFromCookies(cookies: { [key: string]: any }) {
    if (cookies.accessToken) {
      return cookies.accessToken;
    }
    return null;
  }
}
