import { Body, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { Tag } from '../tag.entity';


@Injectable()
export class TagsService {
    constructor(
    /** Inject tags repository */
        @InjectRepository(Tag)
        private readonly tagsRepository: Repository<Tag>
    ) {}

    /**  Create a new tag */
    public async create(createTagDto: CreateTagDto){
        let tag = this.tagsRepository.create(createTagDto);
        return await this.tagsRepository.save(tag);
    }

    /** Given an array of ids find multiple tags */
    public async findMultipleTags(tags: number[]){
        let results = await this.tagsRepository.find({
            where: {
                id: In(tags)
            }
        })
        return results;
    }

    /**  Find all tags */
    public async findAll(createTagDto: CreateTagDto) {
        
    }

    /** Delete tag */
    public async delete(id: number){
        await this.tagsRepository.delete(id);

        return {
            deleted: true,
            id
        }
    }

    // Soft delete - adds a deleted at date but doesn't delete row or join tables association - 
    // used when you want to stop users from having access too a specific tag - but allows users that
    // have already created a post with that tag to still see it 
    public async softRemove(id: number) {
        await this.tagsRepository.softDelete(id);
         return {
            deleted: true,
            id
        }
    }
}
