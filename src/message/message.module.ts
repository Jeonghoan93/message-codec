import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageCodecService } from './message-codec.service';

@Module({
  controllers: [MessageController],
  providers: [MessageCodecService],
})
export class MessageModule {}
