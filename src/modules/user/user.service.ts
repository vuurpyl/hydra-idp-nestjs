import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignupDomain } from '../../domains/signup.domain';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async create(payload: SignupDomain): Promise<User> {
    const existedUser = await this.getByEmail(payload.email);
    if (existedUser) {
      throw new NotAcceptableException('User with provided email already created.');
    }
    const user = await this.userRepository.create(payload);

    try {
      user.password = await argon2.hash(payload.password);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return await this.save(user);
  }

  async save(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async findOneOrFail(payload): Promise<User> {
    return await this.userRepository.findOneOrFail(payload);
  }
}
