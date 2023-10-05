import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [UsersModule, UserModule, MailModule],
})
export class AppModule {}
