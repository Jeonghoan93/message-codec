import { Test, TestingModule } from '@nestjs/testing';
import { MessageCodecService } from '../message-codec.service';
import { MessageDto } from '../dto/message.dto';

describe('MessageService', () => {
  let service: MessageCodecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageCodecService],
    }).compile();

    service = module.get<MessageCodecService>(MessageCodecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Encoding and decoding', () => {
    it('should not lose data', () => {
      const headers = new Map<string, string>();
      const message: MessageDto = {
        headers: headers,
        payload: Buffer.from('Hello, World!'),
      };
      const encoded = service.encode(message);
      const decoded = service.decode(encoded);
      expect(decoded).toEqual(message);
    });

    it('should throw an error if payload is too large', () => {
      const headers = new Map<string, string>();
      const payload = Buffer.alloc(MessageCodecService.MAX_PAYLOAD_SIZE + 1);
      const message: MessageDto = { headers, payload };
      expect(() => service.encode(message)).toThrow(Error);
    });

    it('should throw an error if there are too many headers', () => {
      const headers = new Map<string, string>(
        Array.from({ length: MessageCodecService.MAX_NUM_HEADERS + 1 }).map(
          (_, i) => [`key${i}`, 'value'],
        ),
      );
      const message: MessageDto = {
        headers,
        payload: Buffer.from('Hello, World!'),
      };
      expect(() => service.encode(message)).toThrow(Error);
    });

    it('should throw an error if a header key or value is too large', () => {
      const headers = new Map<string, string>([
        ['key', 'a'.repeat(MessageCodecService.MAX_HEADER_SIZE + 1)],
      ]);
      const message: MessageDto = {
        headers,
        payload: Buffer.from('Hello, World!'),
      };
      expect(() => service.encode(message)).toThrow(Error);
    });
  });
});
