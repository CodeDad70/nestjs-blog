import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { DataSource } from 'typeorm';   
import { User } from '../user.entity';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
    constructor(
        /** Inject datasource */
        private readonly dataSource: DataSource
    ){}
    public async createMany(createManyUsersDto: CreateManyUsersDto) {
        
        let newUsers: User[] = [];
        // Create a Query Runner instance
        const queryRunner = this.dataSource.createQueryRunner();
        try{
            // Connect Query runner to datasource
            await queryRunner.connect();
            // Start transaction 
            await queryRunner.startTransaction();
        } catch(errors){
            throw new RequestTimeoutException (
                'Unable to process request hippie', 
                {
                description: 'Error connecting to DB'
                }
            )
        }
    
        try{
          for(let user of createManyUsersDto.users) {
            let newUser = queryRunner.manager.create(User, user);
            let result = await queryRunner.manager.save(newUser);
            newUsers.push(result);
          }
          // If successful - commit transaction to DB
          await queryRunner.commitTransaction();
        } catch(error) {
            // If unsuccessful rollback changes
            await queryRunner.rollbackTransaction();
            throw new ConflictException(
                'Could not complete transaction', 
                {
                description: String(error)
                }
            )
        } finally {
            try {
                // Release connection
                await queryRunner.release();
            } catch (error) {
                throw new RequestTimeoutException (
                    'Unable to process request hippie', 
                    {
                    description: String(error)
                    }
                )
            }
        } 
        return newUsers;
      }
}
