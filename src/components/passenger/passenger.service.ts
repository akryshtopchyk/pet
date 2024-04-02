import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { IPassenger } from '../../interfaces/passenger.interface';
import { createHmac } from 'crypto';

const SALT = 'HJtEamuN3IXd/Ay0nNa+l+yh';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel('Passenger') private passengerModel: Model<IPassenger>,
  ) {}

  async create(createPassengerDto: CreatePassengerDto): Promise<IPassenger> {
    const newPassenger = await new this.passengerModel(createPassengerDto);
    return newPassenger.save();
  }

  async update(
    passengerId: string,
    updatePassengerDto: UpdatePassengerDto,
  ): Promise<IPassenger> {
    const existingPassenger = await this.passengerModel.findByIdAndUpdate(
      passengerId,
      updatePassengerDto,
      { new: true },
    );
    if (!existingPassenger) {
      throw new NotFoundException(`Passenger #${passengerId} not found`);
    }
    return existingPassenger;
  }

  async getAll(): Promise<IPassenger[]> {
    const passengerData = await this.passengerModel.find();
    if (!passengerData || passengerData.length == 0) {
      throw new NotFoundException('Passengers data not found!');
    }
    return passengerData;
  }

  async getAllById(ids: string[]): Promise<IPassenger[]> {
    const passengerData = await this.passengerModel.find({
      where: { _id: { $eq: ids } },
    });
    if (!passengerData || passengerData.length == 0) {
      throw new NotFoundException('Passengers data not found!');
    }
    return passengerData;
  }

  async getById(id: string): Promise<IPassenger> {
    const existingPassenger = await this.passengerModel.findById(id).exec();
    if (!existingPassenger) {
      throw new NotFoundException(`Passenger #${id} not found`);
    }
    return existingPassenger;
  }

  async getByPhoneNumber(phoneNumber: string): Promise<IPassenger> {
    const existingPassenger = await this.passengerModel
      .findOne({ phoneNumber })
      .exec();
    if (!existingPassenger) {
      throw new NotFoundException(`Passenger #${phoneNumber} not found`);
    }
    return existingPassenger;
  }

  async getByPhone(phoneNumber: string): Promise<IPassenger> {
    const existingPassenger = await this.passengerModel
      .findOne({ phoneNumber })
      .exec();
    return existingPassenger;
  }

  async delete(passengerId: string): Promise<IPassenger> {
    const deletedPassenger = await this.passengerModel.findByIdAndDelete(
      passengerId,
    );
    if (!deletedPassenger) {
      throw new NotFoundException(`Passenger #${passengerId} not found`);
    }
    return deletedPassenger;
  }

  async login(passenger: any): Promise<any> {
    const password = createHmac('sha256', SALT)
      .update(passenger.password)
      .digest('hex');
    const existingPassenger = await this.passengerModel
      .findOne({ phoneNumber: passenger.phoneNumber })
      .exec();
    if (existingPassenger && existingPassenger.password === password) {
      return existingPassenger;
    }
    return false;
  }

  async register(passenger: any): Promise<any> {
    const existingUser = await this.passengerModel.findOne({
      phoneNumber: passenger.phoneNumber,
    });
    if (existingUser) {
      return false;
    }
    const password = createHmac('sha256', SALT)
      .update(passenger.password)
      .digest('hex');
    const newPassenger = await new this.passengerModel({
      ...passenger,
      password,
    });
    return newPassenger.save();
  }
}
