import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TripSchema } from '../../schemas/trip.schema';
import { OrdersModule } from '../order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Trip', schema: TripSchema }]),
    TripsModule,
    OrdersModule,
  ],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService],
})
export class TripsModule {}
