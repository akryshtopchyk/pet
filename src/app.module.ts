import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './components/order/order.module';
import { TripsModule } from './components/trip/trip.module';
import { PassengersModule } from './components/passenger/passenger.module';
import { StopIvanovoMinskModule } from './components/stop-ivanovo-minsk/stop-ivanovo-minsk.module';
import { StopMinskIvanovoModule } from './components/stop-minsk-ivanovo/stop-minsk-ivanovo.module';
import { NewsModule } from './components/news/news.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/yanov'),
    OrdersModule,
    TripsModule,
    PassengersModule,
    StopIvanovoMinskModule,
    StopMinskIvanovoModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}