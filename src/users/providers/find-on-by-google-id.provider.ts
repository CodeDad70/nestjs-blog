import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeoutError } from 'rxjs';

@Injectable()
export class FindOneByGoogleIdProvider {
    constructor(
        /** Inject user repository */
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ){}

    public async findOneByGoogleId(googleId: string) {
        try {
            return this.usersRepository.findOneBy({googleId})
        } catch (error) {
            throw new RequestTimeoutException(error)
        }
    }
}
