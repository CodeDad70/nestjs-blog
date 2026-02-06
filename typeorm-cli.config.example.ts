import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'XXXXXXXXX',
    password: 'XXXXXXXXX',
    database: "XXXXXXXXX",
    entities: ['**/*.entity.js'],
    migrations: ['migrations/*.js']
})