import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from '../message.controller';
import { MessageCodecService } from '../message-codec.service';
import { HttpMessageDto } from '../dto/message.dto';

describe('MessageController', () => {
  let controller: MessageController;
  let service: MessageCodecService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [MessageCodecService],
    }).compile();

    controller = app.get<MessageController>(MessageController);
    service = app.get<MessageCodecService>(MessageCodecService);
  });

  it('should encode', async () => {
    const httpMessage: HttpMessageDto = {
      headers: { test: 'header' },
      payload: Buffer.from('Hello, World!').toString('base64'),
    };

    const spy = jest
      .spyOn(service, 'encode')
      .mockImplementation(() => Buffer.alloc(0));

    await controller.encode(httpMessage);

    expect(spy).toBeCalledWith({
      headers: new Map(Object.entries(httpMessage.headers)),
      payload: Buffer.from(httpMessage.payload, 'base64'),
    });

    spy.mockRestore();
  });

  it('should decode', async () => {
    const buffer = Buffer.from('test');

    const spy = jest.spyOn(service, 'decode').mockImplementation(() => ({
      headers: new Map(),
      payload: Buffer.alloc(0),
    }));

    await controller.decode({ data: buffer.toString('base64') });

    expect(spy).toBeCalledWith(buffer);

    spy.mockRestore();
  });
});
