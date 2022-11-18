import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiDefaultResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { StandardErrorDto } from '../../common/dto/standard-error.dto';
import { RoleType } from '../../constants';
import { AuthUser } from '../../decorators';
import { Auth, Roles } from '../../decorators/http.decorators';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Controller('auth')
@ApiTags('auth')
@Auth(false, [RoleType.ADMIN])
@ApiDefaultResponse({
  type: StandardErrorDto,
})
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  @Roles([RoleType.ADMIN])
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(userRegisterDto);

    return createdUser.toDto();
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  @Roles([RoleType.USER])
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }
}
