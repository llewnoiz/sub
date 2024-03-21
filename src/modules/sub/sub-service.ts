import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user-entity';
import { CreateUserDTO } from './user-create-dto';

@Injectable()
export class SubService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async created(user: CreateUserDTO): Promise<UserEntity> {

    const userEntity = new UserEntity();
    userEntity.name = user.name;
    const result = await this.userRepository.save(userEntity);
    return result;
  }
}