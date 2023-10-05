import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import appConfig from './config/app.config';
import { MailModule } from './mail/mail.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    JwtModule.register({
      secret: appConfig().jwt.secret,
      global: true,
      signOptions: { expiresIn: appConfig().jwt.expiresIn },
    }),
    PrismaModule,
    MailModule,
    UserModule,
    AuthModule,
  ]
})
export class AppModule { }
