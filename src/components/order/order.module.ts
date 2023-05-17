import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderSchema } from '../../schemas/order.schema';
import { DeletedOrderSchema } from 'src/schemas/deleted-order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([
      { name: 'DeletedOrder', schema: DeletedOrderSchema },
    ]),
    OrdersModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrdersModule {}
