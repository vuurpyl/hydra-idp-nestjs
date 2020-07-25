import * as crypto from 'crypto';
import { ConflictException, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { User } from './user.entity';
import { SignupDomain } from '../../domains/signup.domain';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository.createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async getByEmailAndPass(email: string, password: string): Promise<User> {
    const passHash = crypto.createHmac('sha256', password).digest('hex');
    return await this.userRepository.createQueryBuilder('users')
      .where('users.email = :email and users.password = :password')
      .setParameter('email', email)
      .setParameter('password', passHash)
      .getOne();
  }

  async create(payload: SignupDomain): Promise<User> {
    const existedUser = await this.getByEmail(payload.email);
    if (existedUser) {
      throw new NotAcceptableException('User with provided email already created.');
    }
    const user = await this.userRepository.create(payload);
    user.password = payload.password;
    try {
      return await this.save(user);
    } catch (error) {
      throw new ConflictException(error);
    }
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
