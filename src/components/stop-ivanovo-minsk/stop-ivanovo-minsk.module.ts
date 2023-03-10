import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StopIvanovoMinskService } from './stop-ivanovo-minsk.service';
import { StopIvanovoMinskController } from './stop-ivanovo-minsk.controller';
import { StopIvanovoMinskSchema } from '../../schemas/stop-ivanovo-minsk.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'StopIvanovoMinsk', schema: StopIvanovoMinskSchema },
    ]),
    StopIvanovoMinskModule,
  ],
  controllers: [StopIvanovoMinskController],
  providers: [StopIvanovoMinskService],
})
export class StopIvanovoMinskModule {}
