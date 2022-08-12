import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, StoredHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (StoredHash !== hash.toString('hex')) {
      throw new BadRequestException('invalid login');
    }
    return user;
  }

  async signup(email: string, passsword: string) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(passsword, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const newUser = await this.userService.create(email, result);
    return newUser;
  }
}
