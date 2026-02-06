import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { appCreate } from 'src/app.create';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';

export const bootstrapNestApp = async (): Promise<INestApplication> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule, ConfigModule],
        providers: [ConfigService]
    }).compile();
    
    const app = moduleFixture.createNestApplication();
    appCreate(app);
    await app.init();

    const dataSource = app.get<DataSource>(DataSource);
    await dataSource.synchronize(true); // true to create the tables
    
    return app;
}