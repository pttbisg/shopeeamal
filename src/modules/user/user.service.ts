import { createHash } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import generateApiKey from 'generate-api-key';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import { UserNotFoundException } from '../../exceptions';
import { UserRegisterDto } from '../../modules/auth/dto/UserRegisterDto';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { BackendApiService } from '../../shared/services/backend.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { UserDto } from './dtos/user.dto';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private validatorService: ValidatorService,
    private awsS3Service: AwsS3Service,
    private commandBus: CommandBus,
    private backendApiService: BackendApiService,
  ) {}

  /**
   * Find single user
   */
  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  @Transactional()
  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    let user;

    if (userRegisterDto.backendJWT) {
      // call check User to BE
      const backendUserInfo = await this.backendApiService.verifyJWT(
        userRegisterDto.backendJWT,
      );

      if (backendUserInfo?.id) {
        const apiKey = backendUserInfo?.id as string;
        const apiKeyHash = createHash('md5').update(apiKey).digest('hex');
        user = this.userRepository.create({
          id: backendUserInfo?.id as string,
          apiKey: apiKeyHash,
          ...userRegisterDto,
        });
      }
    } else {
      const apiKey = generateApiKey().toString();
      const apiKeyHash = await bcrypt.hash(apiKey, 10);
      user = this.userRepository.create({
        apiKey: apiKeyHash,
        ...userRegisterDto,
      });
    }

    await this.userRepository.save(user);

    return user;
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }
}
