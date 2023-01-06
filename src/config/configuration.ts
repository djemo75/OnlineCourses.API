import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  appEnv: process.env.APP_ENV,
  appPort: process.env.APP_PORT || 3001,
  dbHost: process.env.DATABASE_HOST,
  dbPort: process.env.DATABASE_PORT || 3306,
  dbUsername: process.env.DATABASE_USERNAME,
  dbPassword: process.env.DATABASE_PASSWORD,
  dbName: process.env.DATABASE_NAME,
  googleAuthApi: process.env.GOOGLE_AUTH_API,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleAuthRedirectUrl: process.env.GOOGLE_AUTH_REDIRECT_URL,
  authenticationToken: process.env.AUTHENTICATION_TOKEN,
}));
