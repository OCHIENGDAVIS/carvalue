import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, MiddlewareConsumer } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';

import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
@Module({
  imports: [TypeOrmModule.forFeature([User])], //Automatically creates the repository for us
  controllers: [UsersController],
  providers: [UsersService, AuthService, CurrentUserMiddleware],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
