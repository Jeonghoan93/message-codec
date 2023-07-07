import { Module } from '@nestjs/common';
import { MessageModule } from './message-codec/message.module';

@Module({
  imports: [MessageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
