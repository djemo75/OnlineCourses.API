import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { UserDetails } from './types/UserDetails';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findUserById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findUserByAccessToken(accessToken: string) {
    return await this.userRepository.findOneBy({ accessToken });
  }

  async findUserByRefreshToken(refreshToken: string) {
    return await this.userRepository.findOneBy({ refreshToken });
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async saveUser(user: UserDetails) {
    return this.userRepository.save(user);
  }

  async updateUser(email: string, data: Partial<User>) {
    return this.userRepository.update({ email }, { ...data });
  }
}
