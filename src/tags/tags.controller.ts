import { Body, Controller, Delete, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';

@Controller('tags')
export class TagsController {
    /** Inject tag service */
    constructor(
        private readonly tagsService: TagsService
    ){}
    @Post()
    public create(@Body() createTagDto: CreateTagDto){
        return this.tagsService.create(createTagDto);
    }

    @Delete()
    public async delete(@Query('id', ParseIntPipe) id:number) {
        return this.tagsService.delete(id);
    }

    // Soft delete - adds a deleted at date but doesn't delete row or join tables association - 
    // used when you want to stop users from having access too a specific tag - but allows users that
    // have already created a post with that tag to still see it 
    @Delete('soft-delete')
    public async softDelete(@Query('id', ParseIntPipe) id:number) {
        return this.tagsService.softRemove(id);
    }
}
