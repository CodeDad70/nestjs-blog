import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { MetaOption } from './meta-option.entity';
import { MetaOptionsController } from './meta-options.controller';
import { MetaOptionService } from './providers/meta-options.service';

@Module({
  controllers: [MetaOptionsController],
  providers: [MetaOptionService],
  imports: [TypeOrmModule.forFeature([MetaOption])],
})
export class MetaOptionsModule {}
