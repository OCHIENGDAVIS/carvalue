import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  create = async (email: string, password: string) => {
    const user = this.usersRepository.create({ email, password });
    return await this.usersRepository.save(user);
  };

  findOne = (id: number) => {
    if (!id) return null;
    return this.usersRepository.findOne({ where: { id } });
  };

  update = async (id: number, attrs: Partial<User>) => {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  };

  remove = async (id: number) => {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return await this.usersRepository.remove(user);
  };

  find = (email: string) => {
    return this.usersRepository.find({ where: { email } });
  };
}
