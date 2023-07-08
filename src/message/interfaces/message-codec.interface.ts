import { MessageDto } from '../dto/message.dto';

export interface IMessageCodec {
  encode(message: MessageDto): Buffer;
  decode(data: Buffer): MessageDto;
}
