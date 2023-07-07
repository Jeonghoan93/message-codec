import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { IMessageCodec } from './interfaces/message-codec.interface';

@Injectable()
export class MessageCodecService implements IMessageCodec {
  public static readonly MAX_HEADER_SIZE = 1023; // bytes
  public static readonly MAX_NUM_HEADERS = 63;
  public static readonly MAX_PAYLOAD_SIZE = 256 * 1024; // bytes

  encode(message: MessageDto): Buffer {
    if (message.headers.size > MessageCodecService.MAX_NUM_HEADERS) {
      throw new Error('Too many headers');
    }

    for (const [key, value] of message.headers.entries()) {
      if (
        Buffer.byteLength(key) > MessageCodecService.MAX_HEADER_SIZE ||
        Buffer.byteLength(value) > MessageCodecService.MAX_HEADER_SIZE
      ) {
        throw new Error('Header name or value is too long');
      }
    }

    if (message.payload.length > MessageCodecService.MAX_PAYLOAD_SIZE) {
      throw new Error('Payload is too large');
    }

    const headersStr = JSON.stringify(Array.from(message.headers.entries()));
    const headersBuf = Buffer.from(headersStr, 'utf8');
    const separator = Buffer.from([0]);
    return Buffer.concat([headersBuf, separator, message.payload]);
  }

  decode(data: Buffer): MessageDto {
    const separatorIndex = data.indexOf(0);
    const headersBuf = data.subarray(0, separatorIndex);
    const payload = data.subarray(separatorIndex + 1);

    if (payload.length > MessageCodecService.MAX_PAYLOAD_SIZE) {
      throw new Error('Payload is too large');
    }

    const headersArray = JSON.parse(headersBuf.toString('utf8'));

    if (headersArray.length > MessageCodecService.MAX_NUM_HEADERS) {
      throw new Error('Too many headers');
    }

    for (const [key, value] of headersArray) {
      if (
        Buffer.byteLength(key) > MessageCodecService.MAX_HEADER_SIZE ||
        Buffer.byteLength(value) > MessageCodecService.MAX_HEADER_SIZE
      ) {
        throw new Error('Header name or value is too long');
      }
    }

    const headers = new Map<string, string>(headersArray);
    return { headers, payload };
  }
}
