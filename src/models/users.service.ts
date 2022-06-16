import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createOrUpdate(user: User): Promise<User> {
    const hash = await bcrypt.hash(user.getPassword(), 10);
    user.setPassword(hash);
    return this.usersRepository.save(user);
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.getPassword());
      if (isMatch) {
        return user;
      }
    }
    return null;
  }
  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }
  async updateBalance(id: number, balance: number) {
    return await this.usersRepository.update(id, { balance: balance });
  }
}
