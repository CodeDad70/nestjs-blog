import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';



@Injectable()
export class CreateUserProvider {

     constructor(
        /** Inject Users Repository */
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    
        /** Inject hashing provider */
        @Inject(forwardRef(()=> HashingProvider))
        private readonly hashingProvider: HashingProvider
      ) {}

    public async createUser(createUserDto:CreateUserDto) {
    
        let existingUser;
    
        try{
          /** Check if user already exists via email */
          existingUser = await this.usersRepository.findOne({
            where: {email: createUserDto.email},
          })
        } catch(error){
          console.log(error)
          // Might save the details of exception to db if needed
          throw new RequestTimeoutException(
            'Unable to process request hippie', 
            {description: 'Error connecting to DB'}
          )
        }
        
    
        /** Handle exception */
        if(existingUser) {
          throw new BadRequestException(
            'Email is already in use',
          )
        }
    
        /** Create a new user */
        let newUser = this.usersRepository.create({
            ...createUserDto,
            password: await this.hashingProvider.hashPassword(createUserDto.password)
        });
    
        try{
          return newUser = await this.usersRepository.save(newUser);
        } catch(error){
          throw new RequestTimeoutException(
            'Unable to process request hippie', 
            {
              description: 'Error connecting to DB'
            }
          )
        }
    
        return newUser;
    
      }
}
