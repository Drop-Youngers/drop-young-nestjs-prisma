import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UsersModule, UserModule],
})
export class AppModule {}
