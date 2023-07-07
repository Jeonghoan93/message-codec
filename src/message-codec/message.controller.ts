import { Body, Controller, Post } from '@nestjs/common';
import { HttpMessageDto, MessageDto } from './dto/message.dto';
import { MessageCodecService } from './message-codec.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageCodecService: MessageCodecService) {}

  @Post('encode')
  encode(@Body() message: HttpMessageDto) {
    const transformedMessage: MessageDto = {
      headers: new Map(Object.entries(message.headers)),
      payload: Buffer.from(message.payload, 'base64'),
    };
    return this.messageCodecService.encode(transformedMessage);
  }

  @Post('decode')
  decode(@Body() data: { data: string }) {
    const buffer = Buffer.from(data.data, 'base64');
    const message = this.messageCodecService.decode(buffer);
    const transformedMessage: HttpMessageDto = {
      headers: Object.fromEntries(message.headers.entries()),
      payload: message.payload.toString('base64'),
    };
    return transformedMessage;
  }
}
