import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IOrder } from '../../interfaces/order.interface';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<IOrder>) {}

  async create(createOrderDto: CreateOrderDto): Promise<IOrder> {
    const newOrder = await new this.orderModel(createOrderDto);
    const a = newOrder.save();
    return a;
  }

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<IOrder> {
    const existingOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      updateOrderDto,
      { new: true },
    );
    if (!existingOrder) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    return existingOrder;
  }

  async getAll(): Promise<IOrder[]> {
    const orderData = await this.orderModel.find();
    if (!orderData || orderData.length == 0) {
      return [];
    }
    return orderData;
  }

  async getByTripId(tripId: string): Promise<IOrder[]> {
    const orderData = await this.orderModel.find({ tripId: tripId }).exec();
    if (!orderData || orderData.length == 0) {
      return [];
    }
    return orderData;
  }

  async getByTripIdAndPhone(
    tripId: string,
    phoneNumber: string,
  ): Promise<IOrder[]> {
    const orderData = await this.orderModel
      .find({ tripId: tripId, phoneNumber })
      .exec();
    if (!orderData || orderData.length == 0) {
      return [];
    }
    return orderData;
  }

  async getOrdersByPhoneNumber(phoneNumber: string): Promise<IOrder[]> {
    const orderData = await this.orderModel
      .find({ phoneNumber: phoneNumber })
      .exec();
    if (!orderData || orderData.length == 0) {
      return [];
    }
    return orderData;
  }

  async getById(orderId: string): Promise<IOrder> {
    const existingOrder = await this.orderModel.findById(orderId).exec();
    if (!existingOrder) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    return existingOrder;
  }

  async delete(orderId: string): Promise<IOrder> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    return deletedOrder;
  }

  async deleteByTripId(tripId) {
    return this.orderModel.remove({ tripId: tripId });
  }

  getStops() {
    return {
      mi: [
        { id: 1, name: 'Автостанция "Юго-Западная"', time: 0 },
        { id: 2, name: 'Станция метро "Петровщина"', time: 5 },
        { id: 3, name: 'Станция метро "Малиновка"', time: 10 },
        { id: 4, name: 'Барановичи', time: 100 },
      ],
      im: [
        { id: 1, name: 'Автовокзал Иваново', time: 0 },
        { id: 2, name: 'Иваново Центральная аптека', time: 0 },
        { id: 3, name: 'Иваново Спорткомплекс "Импульс"', time: 0 },
        { id: 4, name: 'Мотоль', time: 10 },
        { id: 5, name: 'Тышковичи', time: 16 },
        { id: 6, name: 'Барановичи', time: 120 },
      ],
    };
  }
}
