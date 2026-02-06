import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsController } from './meta-options/meta-options.controller';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { PaginationModule } from './common/pagination/pagination.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { UploadsModule } from './uploads/uploads.module';
import { Upload } from './uploads/upload.entity';
import { User } from './users/user.entity';
import { MetaOption } from './meta-options/meta-option.entity';
import { Tag } from './tags/tag.entity';
import { Post } from './posts/post.entity'

const ENV = process.env.NODE_ENV

@Module({
  imports: [
    UsersModule, 
    PostsModule, 
    AuthModule,
    TagsModule,
    MetaOptionsModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ['.env.development']
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>({
        type: 'postgres',
        // autoLoadEntities: configService.get('database.autoLoadEntities'),
        // synchronize: configService.get('database.sync'),
        autoLoadEntities: configService.get('database.autoLoadEntities') === 'true',
        synchronize: configService.get('database.sync') === 'true',
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        host: configService.get('database.host'),
        database: configService.get('database.name'), 
        entities: [User, Post, MetaOption, Tag, Upload],
      }),
    }),
    PaginationModule,
    forwardRef(()=> AuthModule),
    ConfigModule.forFeature(jwtConfig), 
    JwtModule.registerAsync(jwtConfig.asProvider()), UploadsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // this is a way to apply the guard GLOBALLY - this effects every controller in the app
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor
    },
    AccessTokenGuard
  ],
})
export class AppModule {}
