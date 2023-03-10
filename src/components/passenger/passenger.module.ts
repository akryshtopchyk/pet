import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { PassengerSchema } from '../../schemas/passenger.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Passenger', schema: PassengerSchema }]),
    PassengersModule,
  ],
  controllers: [PassengerController],
  providers: [PassengerService],
  exports: [PassengerService],
})
export class PassengersModule {}
