import { ConfigService } from "@nestjs/config";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { Post } from "src/posts/post.entity";
import { Tag } from "src/tags/tag.entity";
import { Upload } from "src/uploads/upload.entity";
import { User } from "src/users/user.entity";
import { DataSource } from 'typeorm';
 
export async function dropDatabase(config: ConfigService): Promise<void>{
    // Create connection with datasource
    const AppDataSource = await new DataSource({
        type: 'postgres',
        // autoLoadEntities: configService.get('database.autoLoadEntities'),
        // synchronize: config.get('database.sync'),
        // autoLoadEntities: configService.get('database.autoLoadEntities') === 'true',
        synchronize: config.get('database.sync') === 'true',
        port: config.get('database.port'),
        username: config.get('database.user'),
        password: config.get('database.password'),
        host: config.get('database.host'),
        database: config.get('database.name'), 
        // entities: [User, Post, MetaOption, Tag, Upload],

    }).initialize();
    // Drop all tables 
    await AppDataSource.dropDatabase();
    // Close connection
    await AppDataSource.destroy();
}