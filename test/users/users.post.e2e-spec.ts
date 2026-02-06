import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ConfigService } from '@nestjs/config';
import { dropDatabase } from 'test/helpers/drop-database.helper';
import { bootstrapNestApp } from 'test/helpers/boostrap-nest-app.helper';
import { completeUser, missingEmail, missingFirstName, missingPassword } from './users.post.e2e-spec.sample-data';

describe('[Users] @Post Endpoints (e2e)', () => {
  let app: INestApplication<App>;
  let config: ConfigService
  let httpServer: App;

  beforeEach(async () => {
    app = await bootstrapNestApp();
    // extract the config 
    config = app.get<ConfigService>(ConfigService);
    httpServer = app.getHttpServer();
  });

  afterEach(async ()=> {
    await dropDatabase(config)
    await app.close();
  });

  it('/users - Endpoint is public', ()=> {
    console.log(completeUser)
    return request(httpServer)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(400)
  })

  it('/users - Throws 400 if missing firstName', ()=> {
    return request(httpServer)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(missingFirstName)
      .expect(400)
  });

  it('/users - Throws 400 if missing email', ()=> {
    return request(httpServer)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(missingEmail)
      .expect(400)
  });

  it('/users - Throws 400 if missing password', ()=> {
    return request(httpServer)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(missingPassword)
      .expect(400)
  });

  it('/users - Valid request successfully creates user', ()=> {
      return request(httpServer)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send(completeUser)
        .expect(201)
        .then(({body}) => {
          expect(body).toBeDefined()
          expect(body.data.firstName).toBe(completeUser.firstName)
          expect(body.data.lastName).toBe(completeUser.lastName)
          expect(body.data.email).toBe(completeUser.email)

        })
  });

  it('/users - password is not returned in response', ()=> {
      return request(httpServer)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send(completeUser)
        .expect(201)
        .then(({body}) => {
          expect(body.data.password).toBeUndefined();
        })
  });

  it('/users - googleId is not returned in response', ()=> {
      return request(httpServer)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send(completeUser)
        .expect(201)
        .then(({body}) => {
          expect(body.data.googleId).toBeUndefined();
        })
  });

}); 