import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsJSON,
  IsUrl,
  IsISO8601,
  IsArray,
  ValidateNested,
  MaxLength,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'Example title goes here',
    description: 'Title for the blog post',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(150)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: 'Possible values: "post", "page", "story", "series"',
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: 'For Example: "my-url"',
    example: 'my-blog-post',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all lowercase and use only "-" without spaces. IE: "my-url"',
  })
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: 'Possible values "draft", "scheduled", "review", "published"',
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: 'Contains the content of the blog post',
    example: 'Example blog post would look like this',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Serialize your JSON object or else a validation error will be thrown',
    example: '{\"@context\": \"https://schema.org\", \"@type\": \"Person\"}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Feature image for your blog post',
    example: 'http://localhost.com/images/image1.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'The date on which the blog post is published',
    example: '2026-01-24T15:30:00Z',
  })
  @IsOptional()
  @IsISO8601()
  publishedOn?: String;

  @ApiPropertyOptional({
    description: 'Array of tag ids passed as numbers',
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @ApiPropertyOptional({
    type: CreatePostMetaOptionsDto,
    required: false,
    description: 'The metavalue is a json string'   
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto;
}
