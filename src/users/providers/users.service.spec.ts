import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { FindOneByGoogleIdProvider } from './find-on-by-google-id.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { CreateUserProvider } from './create-user.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';


describe('UsersService', () => {
  
  let service: UsersService
  beforeEach(async () => {
    const mockCreateUserProvider: Partial<CreateUserProvider> = {
      createUser: (createUserDto: CreateUserDto) => 
        Promise.resolve({
          id: 12,
          firstName: createUserDto.firstName ?? '',
          lastName: createUserDto.lastName ?? '',
          email: createUserDto.email ?? '',
          password: createUserDto.password,
        }),
    };


    const module: TestingModule = await Test.createTestingModule({
       providers:[
        UsersService,
        {provide: DataSource, useValue:{}},
        {provide: getRepositoryToken(User), useValue:{}},
        {provide: CreateGoogleUserProvider, useValue: {}},
        {provide: FindOneByGoogleIdProvider, useValue: {}},
        {provide: FindOneUserByEmailProvider, useValue: {}},
        {provide: CreateUserProvider, useValue: mockCreateUserProvider},
        {provide: UsersCreateManyProvider, useValue: {}},
      ],
    }).compile()
    service = module.get<UsersService>(UsersService)
    // CreateUserProvider = module.get(CreateUserProvider)
  });

  describe('root', () => {
    it('Service should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('createUser', () => {
    it('createUser method should defined', () => {
      expect(service.createUser).toBeDefined();
    });

    it('should call createUser on CreateUserProvider', async() => {
      let user = await service.createUser({
        firstName: 'King',
        lastName: 'Monkey',
        email: 'splapslap@email.com',
        password: 'password123'
      })
      expect(user.firstName).toEqual('King');
      
    });
  });
});
