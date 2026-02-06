import { 
  Injectable, 
  RequestTimeoutException, 
  BadRequestException,
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-on-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/google.user.interface';

@Injectable()
export class UsersService {
 constructor(
    // 4. Use the @InjectRepository decorator to match what the module provides
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    /** Inject datasource */
    private readonly dataSource: DataSource,

    /** Inject usersCreateManyProvider */
    private readonly usersCreateManyProvicer: UsersCreateManyProvider,

    /** Inject createUserProvider */
    private readonly createUserProvider: CreateUserProvider,

    /** Inject FindOneUserByEmail provider */
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,

    /** Inject findOneByGoogleIdProvider */
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,

    /** Inject createGoogleUserProvider */
    private readonly createGoogleUserProvider: CreateGoogleUserProvider

  ){}
    

  public async createUser(createUserDto:CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }
  

  /** Method to retrieve all users from the DB */
  public findAll(
    getUsersParamsDto?: GetUsersParamDto,
    limit?: number,
    page?: number,
  ) {

    throw new HttpException({
      status: HttpStatus.I_AM_A_TEAPOT,
      error: 'This API endpoint no longer exists hippie'

    },
    HttpStatus.I_AM_A_TEAPOT,
    {
      // third options object NOT sent back to client - so for internal use
      cause: new Error(),
      description: 'Error thrown becuase endpoint has been sundowned '
    }
  )
    
  }

  /** Method to retrieve a single user from the DB given an id number*/
  public async findOneById(id: number) {
    let user;

    try{
      user = await this.usersRepository.findOneBy({id})
    } catch(error){
      throw new RequestTimeoutException(
        'Unable to process request hippie', 
        {
          description: 'Error connecting to DB'
        }
      )
    }

    if(!user) {
      throw new BadRequestException('The user id does not exist');
    }
    return user;
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvicer.createMany(createManyUsersDto);
  }

  public async findOneByEmail(email: string){
    return await this.findOneUserByEmailProvider.findOneByEmail(email)
  }

  public async findOneByGoogleId(googleId: string){
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
