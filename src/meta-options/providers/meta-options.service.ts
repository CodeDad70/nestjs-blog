import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';
import { MetaOption } from '../meta-option.entity';

@Injectable()
export class MetaOptionService {
    /** Inject metaOptionsRepository */
    constructor(
        @InjectRepository(MetaOption)
        private readonly metaOptionsRepository: Repository<MetaOption>,
    ){}

    public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDto){
        let metaOption = this.metaOptionsRepository.create(
            createPostMetaOptionsDto
        );
        return await this.metaOptionsRepository.save(metaOption)
    }
}
