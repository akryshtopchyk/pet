import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StopMinskIvanovoService } from './stop-minsk-ivanovo.service';
import { StopMinskIvanovoController } from './stop-minsk-ivanovo.controller';
import { StopMinskIvanovoSchema } from '../../schemas/stop-minsk-ivanovo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'StopMinskIvanovo', schema: StopMinskIvanovoSchema },
    ]),
    StopMinskIvanovoModule,
  ],
  controllers: [StopMinskIvanovoController],
  providers: [StopMinskIvanovoService],
})
export class StopMinskIvanovoModule {}
