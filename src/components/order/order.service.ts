import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IOrder } from '../../interfaces/order.interface';
import { IDeletedOrder } from '../../interfaces/deleted-order.interface';
import { PassengerService } from '../passenger/passenger.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<IOrder>,
    private readonly passengerService: PassengerService,
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
    const passenger = await this.passengerService.getByPhone(
      createOrderDto.phoneNumber,
    );
    if (passenger && passenger.isBlock === true) {
      throw new NotFoundException(`block`);
    }
    const newOrder = await new this.orderModel({
      ...createOrderDto,
      date: new Date(),
      isApproved: false,
    });
    const a = newOrder.save();
    return a;
  }

  async newCreate(createOrderDto: CreateOrderDto): Promise<IOrder> {
    const [existingOrder, passenger] = await Promise.all([
      this.orderModel
        .findOne({
          phoneNumber: createOrderDto.phoneNumber,
          tripId: createOrderDto.tripId,
        })
        .lean(),
      this.passengerService.getByPhone(createOrderDto.phoneNumber),
    ]);
    if (existingOrder) {
      throw new ConflictException(
        `Order with phone number ${createOrderDto.phoneNumber} already exists for this trip`,
      );
    }
    if (passenger?.isBlock) {
      throw new ForbiddenException('Passenger is blocked');
    }
    const newOrder = new this.orderModel({
      ...createOrderDto,
      date: new Date(),
      isApproved: false,
    });
    return await newOrder.save();
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

  async getByTripIdData(tripId: string): Promise<any[]> {
    const orderData = await this.orderModel
      .find({ tripId: tripId })
      .lean()
      .select({ _id: 0, seatCount: 1 })
      .exec();
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

  async getOrdersForInfoByPhoneNumber(phoneNumber: string): Promise<any> {
    const orderData = await this.orderModel
      .find({ phoneNumber: phoneNumber })
      .exec();
    const deletedOrderData = await this.deletedOrderModel
      .find({ phoneNumber: phoneNumber })
      .exec();
    if (!orderData || !deletedOrderData) {
      return [];
    }
    return { orderData, deletedOrderData };
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
      throw new NotFoundException(`Order #${orderId} not found`);
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
        { id: 2, name: 'Иваново Центральная Аптека', time: 1 },
        { id: 3, name: 'Иваново Спорткомплекс "Импульс"', time: 3 },
        { id: 4, name: 'Лясковичское лесничество', time: 4 },
        { id: 5, name: 'УПК', time: 5 },
        { id: 6, name: 'Дружиловичи', time: 8 },
        { id: 7, name: 'Замошье', time: 10 },
        { id: 8, name: 'Мотоль', time: 15 },
        { id: 9, name: 'Тышковичи (1 остановка «Кладбище»)', time: 20 },
        { id: 10, name: 'Тышковичи (2 остановка «За памятником»)', time: 21 },
        { id: 11, name: 'Тышковичи (3 остановка «В конце деревни»)', time: 22 },
        { id: 12, name: 'Оброво', time: 35 },
        { id: 13, name: 'Ивацевичи ( остановка возле ТЦ « Мартин»)', time: 50 },
        {
          id: 14,
          name: 'Барановичи ( остановка возле ТЦ « Корона») ',
          time: 100,
        },
      ],
      toIvanovoFromMinsk: [
        { id: 1, name: 'Автовокзал Иваново', time: 0 },
        { id: 2, name: 'Иваново Центральная аптека', time: 1 },
        { id: 3, name: 'Иваново Спорткомплекс "Импульс"', time: 3 },
        { id: 4, name: 'Лясковичское лесничество', time: 4 },
        { id: 5, name: 'УПК', time: 5 },
        { id: 6, name: 'Дружиловичи', time: 8 },
        { id: 7, name: 'Замошье', time: 10 },
        { id: 8, name: 'Мотоль', time: 15 },
        { id: 9, name: 'Тышковичи (1 остановка «Кладбище»)', time: 20 },
        { id: 10, name: 'Тышковичи (2 остановка «За памятником»)', time: 21 },
        { id: 11, name: 'Тышковичи (3 остановка «В конце деревни»)', time: 22 },
        { id: 12, name: 'Оброво', time: 35 },
        { id: 13, name: 'Ивацевичи ( остановка возле ТЦ « Мартин»)', time: 50 },
        {
          id: 14,
          name: 'Барановичи ( остановка возле ТЦ « Корона»)',
          time: 100,
        },
      ],
      fromIvanovoToGrodno: [
        { id: 1, name: 'Иваново Автовокзал', time: 0 },
        { id: 2, name: 'Дрогичин Автовокзал', time: 30 },
        { id: 3, name: 'Хомск', time: 40 },
        { id: 4, name: 'Здитово', time: 45 },
        { id: 5, name: 'Белоозерск', time: 60 },
        { id: 6, name: 'Берёза Автовокзал ', time: 85 },
        { id: 7, name: 'Ружаны (заправка )', time: 85 },
        { id: 8, name: 'Волковыск ( Кольцо )', time: 85 },
      ],
      toIvanovoFromGrodno: [
        { id: 1, name: 'Иваново Автовокзал', time: 0 },
        { id: 2, name: 'Дрогичин Автовокзал', time: 30 },
        { id: 3, name: 'Хомск', time: 40 },
        { id: 4, name: 'Здитово', time: 45 },
        { id: 5, name: 'Белоозерск', time: 60 },
        { id: 6, name: 'Берёза Автовокзал ', time: 85 },
        { id: 7, name: 'Ружаны (заправка )', time: 85 },
        { id: 8, name: 'Волковыск ( Кольцо )', time: 85 },
      ],
      fromGrodnoToIvanovo: [{ id: 1, name: 'Гродно Автовокзал', time: 0 }],
      toGrodnoFromIvanovo: [{ id: 1, name: 'Гродно Автовокзал', time: 0 }],
      fromMoskvaToPinsk: [
        { id: 1, name: 'Москва (автовокзал саларьево)', time: 0 },
        { id: 2, name: 'Минск (метро Могилевская)', time: 490 },
        { id: 4, name: 'Минск(метро Малиновка)"', time: 510 },
        { id: 5, name: 'Барановичи(корона)', time: 610 },
        { id: 6, name: 'Ивацевичи(Мартин)', time: 670 },
        { id: 7, name: 'Телеханы (автовокзал)', time: 710 },
        { id: 8, name: 'Логишин', time: 740 },
        { id: 9, name: 'Пинск кВт', time: 770 },
        { id: 10, name: 'Пинск жд вокзал', time: 780 },
      ],
      toMoskvaFromPinsk: [
        { id: 1, name: 'Москва (автовокзал саларьево)', time: 0 },
        { id: 2, name: 'Минск (метро Могилевская)', time: 490 },
        { id: 4, name: 'Минск(метро Малиновка)', time: 510 },
        { id: 5, name: 'Барановичи(корона)', time: 610 },
        { id: 6, name: 'Ивацевичи(Мартин)', time: 670 },
        { id: 7, name: 'Телеханы (автовокзал)', time: 710 },
        { id: 8, name: 'Логишин', time: 740 },
        { id: 9, name: 'Пинск кВт', time: 770 },
        { id: 10, name: 'Пинск жд вокзал', time: 780 },
      ],
      fromPinskToMoskva: [
        { id: 1, name: 'Пинск жд вокзал', time: 0 },
        { id: 2, name: 'Пинск кВт', time: 10 },
        { id: 4, name: 'Логишин', time: 40 },
        { id: 5, name: 'Телеханы (автовокзал)', time: 70 },
        { id: 6, name: 'Ивацевичи(Мартин)', time: 110 },
        { id: 7, name: 'Барановичи(корона)', time: 170 },
        { id: 8, name: 'Минск(метро Малиновка)', time: 270 },
        { id: 9, name: 'Минск (метро Могилевская)', time: 290 },
        { id: 10, name: 'Москва (автовокзал саларьево)', time: 780 },
      ],
      toPinskFromMoskva: [
        { id: 1, name: 'Пинск жд вокзал', time: 0 },
        { id: 2, name: 'Пинск кВт', time: 10 },
        { id: 4, name: 'Логишин', time: 40 },
        { id: 5, name: 'Телеханы (автовокзал)', time: 70 },
        { id: 6, name: 'Ивацевичи(Мартин)', time: 110 },
        { id: 7, name: 'Барановичи(корона)', time: 170 },
        { id: 8, name: 'Минск(метро Малиновка)', time: 270 },
        { id: 9, name: 'Минск (метро Могилевская)', time: 290 },
        { id: 10, name: 'Москва (автовокзал саларьево)', time: 780 },
      ],
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
  async getByTripIds(
    tripIds: Types.ObjectId[],
  ): Promise<Array<{ tripId: Types.ObjectId; seatCount: number }>> {
    return this.orderModel
      .find({ tripId: { $in: tripIds } })
      .select({ tripId: 1, seatCount: 1 })
      .lean();
  }

  async getOrdersBySearchData(data: string): Promise<any[]> {
    const regex = new RegExp(data.trim(), 'i');
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return await this.orderModel
      .aggregate([
        {
          $match: {
            $or: [
              { phoneNumber: { $regex: regex } },
              { lastName: { $regex: regex } },
            ],
          },
        },
        {
          $lookup: {
            from: 'trips',
            localField: 'tripId',
            foreignField: '_id',
            as: 'tripInfo',
          },
        },
        {
          $unwind: {
            path: '$tripInfo',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $match: {
            'tripInfo.date': { $gte: startOfToday },
          },
        },
        {
          $project: {
            key: '$_id',
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            tripId: '$tripInfo._id',
            date: '$tripInfo.date',
            departureTime: '$tripInfo.departureTime',
            from: '$tripInfo.from',
            to: '$tripInfo.to',
          },
        },
      ])
      .exec();
  }
}
