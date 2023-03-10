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
      .sort({ date: 'asc' });
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
        };
      }),
    );
    return t;
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
        };
      }),
    );
    return t;
  }

  async getByDate(date: string, from: string): Promise<any[]> {
    const tripData = await this.tripModel.find({
      date: {
        $eq: new Date(
          `${+date.split(',')[0]}-${
            +date.split(',')[1] + 1 > 10
              ? +date.split(',')[1] + 1
              : '0' + (+date.split(',')[1] + 1)
          }-${
            +date.split(',')[2] > 10
              ? +date.split(',')[2]
              : '0' + +date.split(',')[2]
          }T00:00:00+00:00`,
        ),
      },
      from: {
        $eq: from,
      },
    });
    if (!tripData || tripData.length == 0) {
      return [];
    }
    const t = await Promise.all(
      tripData.map(async (trip) => {
        const orders = await this.orderService.getByTripId(trip._id);
        console.log(orders);
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
        };
      }),
    );
    return t;
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
          order: orders,
        };
      }),
    );
    return t;
  }
}
