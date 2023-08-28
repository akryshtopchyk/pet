import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IOrder } from '../../interfaces/order.interface';
import { IDeletedOrder } from '../../interfaces/deleted-order.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<IOrder>,
    @InjectModel('DeletedOrder')
    private deletedOrderModel: Model<IDeletedOrder>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<IOrder> {
    const existingOrder = await this.orderModel.findOne({
      phoneNumber: createOrderDto.phoneNumber,
      tripId: createOrderDto.tripId,
    });
    if (existingOrder) {
      throw new NotFoundException(
        `Order #${createOrderDto.phoneNumber} already exists`,
      );
    }
    const newOrder = await new this.orderModel({
      ...createOrderDto,
      date: new Date(),
    });
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
    try {
      const order: any = await this.orderModel.findById(orderId);
      const { _id, ...newDeletedOrder } = order._doc;
      const newOrder = await new this.orderModel({
        ...newDeletedOrder,
        date: new Date(),
      });
      await this.deletedOrderModel.create(newOrder);
      const deletedOrder = await this.orderModel.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        throw new NotFoundException(`Order #${orderId} not found`);
      }
      return deletedOrder;
    } catch (e) {
      console.log(e);
    }
  }

  async deleteByTripId(tripId) {
    return this.orderModel.remove({ tripId: tripId });
  }

  getStops() {
    return {
      mi: [
        { id: 1, name: 'Автостанция "Юго-Западная"', time: 0 },
        { id: 2, name: 'Станция метро "Петровщина"', time: 5 },
        { id: 3, name: 'Барановичи', time: 100 },
        { id: 4, name: 'Ивацевичи', time: 150 },
      ],
      im: [
        { id: 1, name: 'Автовокзал Иваново', time: 0 },
        { id: 2, name: 'Иваново Центральная аптека', time: 1 },
        { id: 3, name: 'Иваново магазин "Санта"', time: 2 },
        { id: 4, name: 'Иваново Спорткомплекс "Импульс"', time: 3 },
        { id: 5, name: 'Лясковичское лесничество', time: 4 },
        { id: 6, name: 'УПК', time: 5 },
        { id: 7, name: 'Мотоль', time: 10 },
        { id: 8, name: 'Тышковичи', time: 16 },
        { id: 9, name: 'Ивацевичи', time: 50 },
        { id: 10, name: 'Барановичи', time: 100 },
      ],
      fromMinskToIvanovo: [
        { id: 1, name: 'Автостанция "Юго-Западная"', time: 0 },
        { id: 2, name: 'Станция метро "Петровщина"', time: 5 },
        { id: 3, name: 'Барановичи', time: 100 },
        { id: 4, name: 'Ивацевичи', time: 150 },
      ],
      toMinskFromIvanovo: [
        { id: 1, name: 'Автостанция "Юго-Западная"', time: 0 },
        { id: 2, name: 'Станция метро "Петровщина"', time: 5 },
        { id: 3, name: 'Станция метро "Малиновка"', time: 5 },
        { id: 4, name: 'Барановичи', time: 100 },
        { id: 5, name: 'Ивацевичи', time: 150 },
      ],
      fromIvanovoToMinsk: [
        { id: 1, name: 'Автовокзал Иваново', time: 0 },
        { id: 2, name: 'Иваново Центральная аптека', time: 1 },
        { id: 3, name: 'Иваново магазин "Санта"', time: 2 },
        { id: 4, name: 'Иваново Спорткомплекс "Импульс"', time: 3 },
        { id: 5, name: 'Лясковичское лесничество', time: 4 },
        { id: 6, name: 'УПК', time: 5 },
        { id: 7, name: 'Мотоль', time: 10 },
        { id: 8, name: 'Тышковичи', time: 16 },
        { id: 9, name: 'Ивацевичи', time: 50 },
        { id: 10, name: 'Барановичи', time: 100 },
      ],
      toIvanovoFromMinsk: [
        { id: 1, name: 'Автовокзал Иваново', time: 0 },
        { id: 2, name: 'Иваново Центральная аптека', time: 1 },
        { id: 3, name: 'Иваново магазин "Санта"', time: 2 },
        { id: 4, name: 'Иваново Спорткомплекс "Импульс"', time: 3 },
        { id: 5, name: 'Лясковичское лесничество', time: 4 },
        { id: 6, name: 'УПК', time: 5 },
        { id: 7, name: 'Мотоль', time: 10 },
        { id: 8, name: 'Тышковичи', time: 16 },
        { id: 9, name: 'Ивацевичи', time: 50 },
        { id: 10, name: 'Барановичи', time: 100 },
      ],
      fromIvanovoToGrodno: [
        { id: 1, name: 'Иваново Автовокзал', time: 0 },
        { id: 2, name: 'Дрогичин', time: 30 },
        { id: 3, name: 'Хомск', time: 45 },
        { id: 4, name: 'Белоозерск', time: 60 },
        { id: 5, name: 'Берёза Автовокзал ', time: 85 },
      ],
      toIvanovoFromGrodno: [
        { id: 1, name: 'Иваново Автовокзал', time: 0 },
        { id: 2, name: 'Дрогичин', time: 30 },
        { id: 3, name: 'Хомск', time: 45 },
        { id: 4, name: 'Белоозерск', time: 60 },
        { id: 5, name: 'Берёза Автовокзал ', time: 85 },
      ],
      fromGrodnoToIvanovo: [{ id: 1, name: 'Гродно Автовокзал', time: 0 }],
      toGrodnoFromIvanovo: [{ id: 1, name: 'Гродно Автовокзал', time: 0 }],
    };
  }
  async getAllDeletedByTripId(tripId): Promise<IOrder[]> {
    const orderData = await this.deletedOrderModel
      .find({ tripId: tripId })
      .exec();
    if (!orderData || orderData.length == 0) {
      return [];
    }
    return orderData;
  }
}
