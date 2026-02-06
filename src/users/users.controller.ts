import {
  Controller,
  Param,
  Get,
  Post,
  Patch,
  Put, 
  Delete,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
  Headers,
  Ip,
  ValidationPipe,
  UseGuards,
  SetMetadata,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/{:id}/')
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Which page in the pagination order to query',
    example: 1,
  })
  public getUsers(
    @Param() getUsersParamsDto?: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    return this.usersService.findAll(getUsersParamsDto, limit, page);
  }

  @Post()
  // @UseGuards(AccessTokenGuard)
  // out of the box decorator that allows public methods to be used 
  // despite the fact that we have auth guard on all routes site wide 
  // @SetMetadata('authType', 'none')
  
  // custom decorator that allows this public function to be used without a JWT token 
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  public createUser(
    @Body() createUserDto: CreateUserDto,
    @Headers() headers: any,
    @Ip() ip: string,
  ) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('create-many')
  public createManyUsers(
    @Body() createManyUsersDto: CreateManyUsersDto,
    @Headers() headers: any,
    @Ip() ip: string,
  ) {
    return this.usersService.createMany(createManyUsersDto);
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
