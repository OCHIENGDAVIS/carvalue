import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  UseInterceptors,
} from '@nestjs/common';

import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize-interceptor';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body.email, body.password);
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('handler is running');
    return await this.userService.findOne(parseInt(id));
  }

  @Get('/')
  async findAllUsers(@Query('email') email: string) {
    return await this.userService.find(email);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.userService.update(parseInt(id), body);
  }
}
