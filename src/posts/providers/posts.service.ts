import { BadRequestException, Body, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dts';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
  constructor(
     /**  Injecting User Service */
    private readonly usersService: UsersService, 

    /**  Injecting Post Repository */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**  Injecting MetaOptions Repository */
    @InjectRepository(MetaOption)
    public readonly metaOptionsRepository: Repository<MetaOption>,

    /** Inject tags service */ 
    private readonly tagsService: TagsService,

    /** Inject pagintion provider */
    public readonly paginationProvider: PaginationProvider,

    /** Inject createPostProvider */
    private readonly createPostProvider: CreatePostProvider
  ) {}

  /**  Create new post */
  public async create(createPostDto: CreatePostDto, user: ActiveUserData){
     return await this.createPostProvider.create(createPostDto, user);
  }

  /**  Find all posts for a user given a userId */
  public async findAll(postQuery: GetPostsDto, userId: string): Promise<Paginated<Post>> {
    // let posts = await this.postsRepository.find();
    // how to fetch relation data without using eager: true in the entity file 
    let posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page
      },
      this.postsRepository
    )
    return posts;
  }

  public async update(patchPostDto: PatchPostDto){

    let tags;
    let post;

    // 1. Find tags
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags ?? []);
      } catch (error) {
        throw new RequestTimeoutException(
          'Unable to process request'
        )
    }
    
    if (!tags || tags?.lenth !== patchPostDto?.tags?.length) {
      throw new BadRequestException(
        'Pleace check tag IDs and ensure they are correct dumbass.'
      )
    }

    // 2. Find the Post
    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id
      });
    } catch {
       throw new RequestTimeoutException(
          'Unable to process request'
        )
    }

    if (!post) {
      throw new BadRequestException(
        'Post not found.'
      )
    }

    // 3. Handle the NULL case (Crucial Step)
    // TypeScript Flow Analysis knows that if we pass this line, 'post' is not null.
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    // Update the properties of the post 
    
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = patchPostDto.publishedOn ?? post.publishedOn;

    // 6. Manually assign the resolved Tag entities
    post.tags = tags;

    // 7. Save
    try{
      await this.postsRepository.save(post);
    } catch {
        throw new RequestTimeoutException(
          'Unable to process request'
        ) 
    }
    return post;

  }

  /** Delete Posts */
  public async delete(id: number){
    try{
      await this.postsRepository.delete(id);
    } catch {
      throw new RequestTimeoutException(
          'Unable to process request'
        )
    }
    // confirmation
    return {deleted: true, id}
  }
}
