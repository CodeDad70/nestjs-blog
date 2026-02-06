import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository, ObjectLiteral} from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { CreateUserProvider } from './create-user.provider';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { User } from '../user.entity';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral > = Partial<Record<keyof Repository<T> , jest.Mock>>

const createMockRepository = <T extends ObjectLiteral >():MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
})

describe('CreateUserProvider', () => {
    let usersRepository;
    let provider;

    const user = {
        firstName: 'Happy',
        lastName: 'Slappy',
        email: 'happyslappy@email.com',
        password: 'password123'
    }
    beforeEach(async () => {    
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                CreateUserProvider,
                {provide: HashingProvider, useValue: {}},
                {provide: DataSource, useValue:{}},
                {provide: getRepositoryToken(User), useValue: createMockRepository()},
                {
                    provide: HashingProvider, 
                    useValue: {hashPassword: jest.fn(() => user.password)}
                }
            ],
        }).compile()

        provider = module.get<CreateUserProvider>(CreateUserProvider)
        usersRepository = module.get(getRepositoryToken(User));
    });

    describe('root', () => {
        it('createUserProvider should be defined', () => {
            expect(provider).toBeDefined();
        });
    });

    describe('createUser', () => {
        describe('When user does not exist in db', ()=> {
            it('should create a new user', async () => {
                usersRepository.findOne.mockReturnValue(null);
                usersRepository.create.mockReturnValue(user);
                usersRepository.save.mockReturnValue(user);
                const newUser = await provider.createUser(user);
                expect(usersRepository.findOne).toHaveBeenCalledWith({where: {email: user.email}});
                expect(usersRepository.create).toHaveBeenCalledWith(user);
                expect(usersRepository.save).toHaveBeenCalledWith(user);
            });
        });

        describe('When user already exists in the db', () => {
            it('should throw a BadRequestException', async ()=>{
                usersRepository.findOne.mockReturnValue(null);
                usersRepository.create.mockReturnValue(user);
                usersRepository.save.mockReturnValue(user);
                try{
                    const newUser = await provider.createUser(user);
                } catch(error){
                    expect(error).toBeInstanceOf(BadRequestException);
                };
            });
        });
    });
});
