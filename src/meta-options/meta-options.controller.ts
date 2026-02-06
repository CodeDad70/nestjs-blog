import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';
import { MetaOptionService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
    /** Inject meta-options service */
    constructor(
        private readonly metaOptionsService: MetaOptionService
    ){}
    @Post()
    
    public create(@Body() CreatePostMetaOptionsDto: CreatePostMetaOptionsDto) {
        return this.metaOptionsService.create(CreatePostMetaOptionsDto);
    }
}
