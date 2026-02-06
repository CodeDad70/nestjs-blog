import { BadRequestException, Body, ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class CreatePostProvider {

    constructor(
        /**  Injecting User Service */
        private readonly usersService: UsersService, 

        /**  Injecting Post Repository */
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,

        /** Inject tags service */ 
        private readonly tagsService: TagsService,

    ) {}
    

    /**  Create new post */
    public async create(createPostDto: CreatePostDto, user: ActiveUserData){
        let author;
        let tags;
        try{
            // find author from DB using author id 
            author = await this.usersService.findOneById(user.sub)

            // find tags 
            tags = await this.tagsService.findMultipleTags(createPostDto.tags ?? [])
        } catch(error){
            throw new ConflictException(error);
        }
    if(createPostDto.tags?.length !== tags?.length){
        throw new BadRequestException('Please check tag ids')
    } 

    let post = this.postsRepository.create({
        ...createPostDto,
        author: author,
        metaOptions: createPostDto.metaOptions,
        tags: tags
    });

    try{
        return await this.postsRepository.save(post);
        } catch(error){
            throw new ConflictException(error, {
                description: 'Ensure post slug is unique and not a duplicate'
            })
        }
    }
    
}
