import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/getAll')
  async getAll(@Res() response) {
    try {
      const newOrder = await this.orderService.getAll();
      return response.status(HttpStatus.CREATED).json(newOrder);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order not created!',
        error: 'Bad Request',
        err,
      });
    }
  }

  @Post()
  async createOrder(@Res() response, @Body() createOrderDto: CreateOrderDto) {
    try {
      const newOrder = await this.orderService.newCreate(createOrderDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Order has been created successfully',
        newOrder,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Order not created!',
        error: 'Bad Request',
        err,
      });
    }
  }

  @Put('/:id')
  async updateOrder(
    @Res() response,
    @Param('id') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      const existingOrder = await this.orderService.update(
        orderId,
        updateOrderDto,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Order has been successfully updated',
        existingOrder,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/stops')
  async getStops(@Res() response) {
    try {
      const orderData = await this.orderService.getStops();
      return response.status(HttpStatus.OK).json({
        message: 'All orders data found successfully',
        orderData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/deleted/:id')
  async getDeleted(@Res() response, @Param('id') tripId: string) {
    try {
      const orderData = await this.orderService.getAllDeletedByTripId(tripId);
      return response.status(HttpStatus.OK).json({
        message: 'All orders data found successfully',
        orderData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getOrdersByTrip(@Res() response, @Param('id') tripId: string) {
    try {
      const orderData = await this.orderService.getByTripId(tripId);
      return response.status(HttpStatus.OK).json({
        message: 'All orders data found successfully',
        orderData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/phone/:phoneNumber')
  async getOrdersByPhoneNumber(
    @Res() response,
    @Param('phoneNumber') number: string,
  ) {
    try {
      const orderData = await this.orderService.getOrdersByPhoneNumber(number);
      return response.status(HttpStatus.OK).json({
        message: 'All orders data found successfully',
        orderData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/info/:phoneNumber')
  async getOrdersForInfoByPhoneNumber(
    @Res() response,
    @Param('phoneNumber') number: string,
  ) {
    try {
      const orderData = await this.orderService.getOrdersForInfoByPhoneNumber(
        number,
      );
      return response.status(HttpStatus.OK).json({
        message: 'All orders data found successfully',
        orderData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  // @Get('/:id')
  // async getOrder(@Res() response, @Param('id') orderId: string) {
  //   try {
  //     const existingOrder = await this.orderService.getById(orderId);
  //     return response.status(HttpStatus.OK).json({
  //       message: 'Order found successfully',
  //       existingOrder,
  //     });
  //   } catch (err) {
  //     return response.status(err.status).json(err.response);
  //   }
  // }

  @Delete('/:id')
  async deleteOrder(@Res() response, @Param('id') orderId: string) {
    try {
      const deletedOrder = await this.orderService.delete(orderId);
      return response.status(HttpStatus.OK).json({
        message: 'Order deleted successfully',
        deletedOrder,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
