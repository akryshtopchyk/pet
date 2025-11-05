import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { ITrip } from '../../interfaces/trip.interface';
import { OrderService } from '../order/order.service';

@Injectable()
export class TripService {
  constructor(
    @InjectModel('Trip') private tripModel: Model<ITrip>,
    private readonly orderService: OrderService,
  ) {}

  async create(createTripDto: CreateTripDto): Promise<ITrip> {
    const newTrip = await new this.tripModel(createTripDto);
    return newTrip.save();
  }

  async update(tripId: string, updateTripDto: UpdateTripDto): Promise<ITrip> {
    const existingTrip = await this.tripModel.findByIdAndUpdate(
      tripId,
      updateTripDto,
      { new: true },
    );
    if (!existingTrip) {
      throw new NotFoundException(`Trip #${tripId} not found`);
    }
    return existingTrip;
  }

  async getNewAll(): Promise<any[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const tripData = await this.tripModel
      .find({
        date: { $gte: startOfToday },
      })
      .select({
        _id: 1,
        date: 1,
        from: 1,
        to: 1,
        sum: 1,
        arrivalTime: 1,
        departureTime: 1,
        seatCount: 1,
        car: 1,
        driver: 1,
      })
      .sort({ date: 1, departureTime: 1 })
      .lean()
      .exec();

    if (!tripData.length) {
      return [];
    }

    const tripIds = tripData.map((trip) => trip._id);

    const orders = await this.orderService.getByTripIds(tripIds);

    const ordersMap = orders.reduce((acc, order) => {
      const tripIdStr = order.tripId.toString();
      acc.set(tripIdStr, (acc.get(tripIdStr) || 0) + order.seatCount);
      return acc;
    }, new Map());

    return tripData.map((trip) => ({
      _id: trip._id,
      date: trip.date,
      from: trip.from,
      to: trip.to,
      sum: trip.sum,
      arrivalTime: trip.arrivalTime,
      departureTime: trip.departureTime,
      seatCount: trip.seatCount,
      orders: ordersMap.get(trip._id.toString()) || 0, // если нет заказов, то 0
      car: trip.car,
      driver: trip.driver,
    }));
  }

  async getAll(): Promise<any[]> {
    const tripData = await this.tripModel
      .find({
        date: {
          $gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
          ),
        },
      })
      .lean()
      .sort({ date: 'asc', departureTime: 'asc' });
    if (!tripData || tripData.length == 0) {
      return [];
    }
    const t = await Promise.all(
      tripData.map(async (trip) => {
        const orders = await this.orderService.getByTripId(trip._id);
        return {
          _id: trip._id,
          date: trip.date,
          from: trip.from,
          to: trip.to,
          sum: trip.sum,
          arrivalTime: trip.arrivalTime,
          departureTime: trip.departureTime,
          seatCount: trip.seatCount,
          orders: orders.reduce((a: any, b: any) => a + b.seatCount, 0),
          car: trip.car,
          driver: trip.driver,
        };
      }),
    );
    return t;
  }

  async newGetAll(): Promise<any[]> {
    const tripData = await this.tripModel
      .find({
        date: {
          $gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
          ),
        },
      })
      .lean()
      .sort({ date: 'asc', departureTime: 'asc' });
    if (!tripData || tripData.length == 0) {
      return [];
    }
    const t = await Promise.all(
      tripData.map(async (trip) => {
        const orders = await this.orderService.getByTripIdData(trip._id);
        return {
          _id: trip._id,
          date: trip.date,
          from: trip.from,
          to: trip.to,
          sum: trip.sum,
          arrivalTime: trip.arrivalTime,
          departureTime: trip.departureTime,
          seatCount: trip.seatCount,
          orders: orders.reduce((a: any, b: any) => a + b.seatCount, 0),
          car: trip.car,
          driver: trip.driver,
        };
      }),
    );
    return t;
  }

  async getGIAll(): Promise<any[]> {
    try {
      const now = new Date();
      const tripData = await this.tripModel
        .find({
          date: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          },
        })
        .or([{ from: 'grodno' }, { to: 'grodno' }])
        .lean()
        .sort({ date: 'asc', departureTime: 'asc' });
      if (!tripData || tripData.length == 0) {
        return [];
      }
      const t = await Promise.all(
        tripData.map(async (trip) => {
          const orders = await this.orderService.getByTripId(trip._id);
          return {
            _id: trip._id,
            date: trip.date,
            from: trip.from,
            to: trip.to,
            sum: trip.sum,
            arrivalTime: trip.arrivalTime,
            departureTime: trip.departureTime,
            seatCount: trip.seatCount,
            orders: orders.reduce((a: any, b: any) => a + b.seatCount, 0),
            car: trip.car,
            driver: trip.driver,
          };
        }),
      );
      return t;
    } catch (e) {
      console.log(e);
    }
  }

  async getNewGIAll(): Promise<any[]> {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endDate = new Date(startOfToday);
    endDate.setDate(endDate.getDate() + 8);

    const query: any = {
      date: { $gte: startOfToday },
      $or: [{ from: 'grodno' }, { to: 'grodno' }],
    };

    const tripData = await this.tripModel.aggregate([
      {
        $match: query,
      },
      {
        $sort: { date: 1, departureTime: 1 },
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'tripId',
          as: 'orders',
        },
      },
      {
        $addFields: {
          ordersCount: {
            $sum: '$orders.seatCount',
          },
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          from: 1,
          to: 1,
          sum: 1,
          arrivalTime: 1,
          departureTime: 1,
          seatCount: 1,
          car: 1,
          driver: 1,
          orders: '$ordersCount',
        },
      },
    ]);

    if (!tripData.length) {
      return [];
    }

    return tripData;
  }

  async getMIAll(isFull: string): Promise<any[]> {
    let tripData = [];
    if (isFull === 'true') {
      tripData = await this.tripModel
        .find({
          date: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
            ),
          },
        })
        .or([
          { from: 'minsk' },
          { to: 'minsk' },
          { from: 'moskva' },
          { to: 'moskva' },
        ])
        .lean()
        .sort({ date: 'asc', departureTime: 'asc' });
    } else {
      const date = new Date();
      date.setDate(date.getDate() + 8);
      tripData = await this.tripModel
        .find({
          date: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
            ),
            $lte: date,
          },
        })
        .or([
          { from: 'minsk' },
          { to: 'minsk' },
          { from: 'moskva' },
          { to: 'moskva' },
        ])
        .lean()
        .sort({ date: 'asc', departureTime: 'asc' });
    }
    if (!tripData || tripData.length == 0) {
      return [];
    }
    const t = await Promise.all(
      tripData.map(async (trip) => {
        const orders = await this.orderService.getByTripIdData(trip._id);
        return {
          _id: trip._id,
          date: trip.date,
          from: trip.from,
          to: trip.to,
          sum: trip.sum,
          arrivalTime: trip.arrivalTime,
          departureTime: trip.departureTime,
          seatCount: trip.seatCount,
          orders: orders.reduce((a: any, b: any) => a + b.seatCount, 0),
          car: trip.car,
          driver: trip.driver,
        };
      }),
    );
    return t;
  }

  async getNewMIAll(isFull: string): Promise<any[]> {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endDate = new Date(startOfToday);
    endDate.setDate(endDate.getDate() + 8);

    const query: any = {
      date: { $gte: startOfToday },
      $or: [
        { from: 'minsk' },
        { to: 'minsk' },
        { from: 'moskva' },
        { to: 'moskva' },
      ],
    };

    if (isFull !== 'true') {
      query.date.$lte = endDate;
    }

    const tripData = await this.tripModel.aggregate([
      {
        $match: query,
      },
      {
        $sort: { date: 1, departureTime: 1 },
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'tripId',
          as: 'orders',
        },
      },
      {
        $addFields: {
          ordersCount: {
            $sum: '$orders.seatCount',
          },
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          from: 1,
          to: 1,
          sum: 1,
          arrivalTime: 1,
          departureTime: 1,
          seatCount: 1,
          car: 1,
          driver: 1,
          orders: '$ordersCount',
        },
      },
    ]);

    if (!tripData.length) {
      return [];
    }

    return tripData;
  }

  async newGetHistory(): Promise<any[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const tripData = await this.tripModel.aggregate([
      {
        $match: {
          date: { $lt: yesterday },
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'tripId',
          as: 'orders',
        },
      },
      {
        $addFields: {
          ordersCount: {
            $sum: '$orders.seatCount',
          },
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          from: 1,
          to: 1,
          sum: 1,
          arrivalTime: 1,
          departureTime: 1,
          seatCount: 1,
          car: 1,
          driver: 1,
          orders: '$ordersCount',
        },
      },
    ]);
    return tripData;
  }

  async getHistory(): Promise<any[]> {
    const tripData = await this.tripModel.find({
      date: {
        $lte: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - 1,
        ),
      },
    });
    if (!tripData || tripData.length == 0) {
      return [];
    }
    const t = await Promise.all(
      tripData.map(async (trip) => {
        const orders = await this.orderService.getByTripId(trip._id);
        return {
          _id: trip._id,
          date: trip.date,
          from: trip.from,
          to: trip.to,
          sum: trip.sum,
          arrivalTime: trip.arrivalTime,
          departureTime: trip.departureTime,
          seatCount: trip.seatCount,
          orders: orders.reduce((a: any, b: any) => a + b.seatCount, 0),
          car: trip.car,
          driver: trip.driver,
        };
      }),
    );
    return t;
  }

  async getByDate(date: string, from: string): Promise<any[]> {
    const tripData = await this.tripModel.find({
      date: {
        $eq: this.getDate(date),
      },
      from: {
        $eq: from,
      },
      to: {
        $eq: from === 'ivanovo' ? 'minsk' : 'ivanovo',
      },
    });
    if (!tripData || tripData.length == 0) {
      return [];
    }
    const t = await Promise.all(
      tripData.map(async (trip) => {
        const orders = await this.orderService.getByTripId(trip._id);
        return {
          _id: trip._id,
          date: trip.date,
          from: trip.from,
          to: trip.to,
          sum: trip.sum,
          arrivalTime: trip.arrivalTime,
          departureTime: trip.departureTime,
          seatCount: trip.seatCount,
          orders: orders.reduce((a: any, b: any) => a + b.seatCount, 0),
          car: trip.car,
          driver: trip.driver,
        };
      }),
    );
    return t;
  }

  async getByDateV2(date: string, from: string, to: string): Promise<any[]> {
    const tripData = await this.tripModel.find({
      date: {
        $eq: this.getDate(date),
      },
      from: {
        $eq: from,
      },
      to: {
        $eq: to,
      },
    });
    if (!tripData || tripData.length == 0) {
      return [];
    }
    const t = await Promise.all(
      tripData.map(async (trip) => {
        const orders = await this.orderService.getByTripId(trip._id);
        return {
          _id: trip._id,
          date: trip.date,
          from: trip.from,
          to: trip.to,
          sum: trip.sum,
          arrivalTime: trip.arrivalTime,
          departureTime: trip.departureTime,
          seatCount: trip.seatCount,
          orders: orders.reduce((a: any, b: any) => a + b.seatCount, 0),
          car: trip.car,
          driver: trip.driver,
        };
      }),
    );
    return t;
  }

  private getDate(date: string) {
    const year = +date.split(',')[0];
    const month =
      +date.split(',')[1] + 1 >= 10
        ? +date.split(',')[1] + 1
        : '0' + (+date.split(',')[1] + 1);
    const day =
      +date.split(',')[2] >= 10
        ? +date.split(',')[2]
        : '0' + +date.split(',')[2];
    return new Date(`${year}-${month}-${day}T00:00:00+00:00`);
  }

  async getById(tripId: string): Promise<any> {
    const trip = await this.tripModel.findById(tripId).exec();
    if (!trip) {
      throw new NotFoundException(`Trip #${tripId} not found`);
    }
    const orders = await this.orderService.getByTripId(trip._id);
    return {
      _id: trip._id,
      date: trip.date,
      from: trip.from,
      to: trip.to,
      sum: trip.sum,
      arrivalTime: trip.arrivalTime,
      departureTime: trip.departureTime,
      seatCount: trip.seatCount,
      car: trip.car,
      driver: trip.driver,
      orders: orders.reduce((a: any, b: any) => a + b.seatCount, 0),
    };
  }

  async delete(tripId: string): Promise<ITrip> {
    await this.orderService.deleteByTripId(tripId);
    const deletedTrip = await this.tripModel.findByIdAndDelete(tripId);
    if (!deletedTrip) {
      throw new NotFoundException(`Trip #${tripId} not found`);
    }
    return deletedTrip;
  }

  async deleteOlder() {
    await this.tripModel.deleteMany({
      date: {
        $lte: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - 1,
          23,
          59,
        ),
      },
    });
  }

  async getTripsWithOrders(ids: string[], phoneNumber: string) {
    const tripData = await this.tripModel.find({ _id: { $in: ids } });
    if (!tripData || tripData.length == 0) {
      return [];
    }
    const t = await Promise.all(
      tripData.map(async (trip) => {
        const orders = await this.orderService.getByTripIdAndPhone(
          trip._id,
          phoneNumber,
        );
        return {
          _id: trip._id,
          date: trip.date,
          from: trip.from,
          to: trip.to,
          sum: trip.sum,
          arrivalTime: trip.arrivalTime,
          departureTime: trip.departureTime,
          seatCount: trip.seatCount,
          car: trip.car,
          driver: trip.driver,
          order: orders,
        };
      }),
    );
    return t;
  }

  async getOrdersBySearchData(data: string): Promise<any[]> {
    if (!data?.trim()) {
      return [];
    }
    const result = await this.orderService.getOrdersBySearchData(data);

    return result.map((item) => ({
      ...item,
      key: item.key.toString(),
      tripId: item.tripId.toString(),
    }));
  }
}
