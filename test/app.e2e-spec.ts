import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MessageController } from '../src/message/message.controller';
import { HttpMessageDto } from 'src/message/dto/message.dto';

describe('App Module (e2e)', () => {
  let app;
  let controller: MessageController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get<MessageController>(MessageController);
    await app.init();
  });
  it('/message/encode (POST)', () => {
    return request(app.getHttpServer())
      .post('/message/encode')
      .send({
        headers: { test: 'header' },
        payload: Buffer.from('Hello, World!').toString('base64'),
      })
      .expect(201);
  });

  it('/message/decode (POST)', () => {
    const headers = { test: 'header' };
    const message: HttpMessageDto = {
      headers: headers,
      payload: Buffer.from('Hello, World!').toString('base64'),
    };
    const encoded = controller.encode(message).toString('base64');

    return request(app.getHttpServer())
      .post('/message/decode')
      .send({ data: encoded })
      .expect(201);
  });
});
