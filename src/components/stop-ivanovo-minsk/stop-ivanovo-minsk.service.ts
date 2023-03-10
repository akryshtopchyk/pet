import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStopIvanovoMinskDto } from './dto/create-stop-ivanovo-minsk.dto';
import { UpdateStopIvanovoMinskDto } from './dto/update-stop-ivanovo-minsk.dto';
import { IStopIvanovoMinsk } from '../../interfaces/stop-ivanovo-minsk.interface';

@Injectable()
export class StopIvanovoMinskService {
  constructor(
    @InjectModel('StopIvanovoMinsk')
    private stopIvanovoMinskModel: Model<IStopIvanovoMinsk>,
  ) {}

  async create(
    createStopIvanovoMinskDto: CreateStopIvanovoMinskDto,
  ): Promise<IStopIvanovoMinsk> {
    const newStopIvanovoMinsk = await new this.stopIvanovoMinskModel(
      createStopIvanovoMinskDto,
    );
    return newStopIvanovoMinsk.save();
  }

  async update(
    stopIvanovoMinskId: string,
    updateStopIvanovoMinskDto: UpdateStopIvanovoMinskDto,
  ): Promise<IStopIvanovoMinsk> {
    const existingStopIvanovoMinsk =
      await this.stopIvanovoMinskModel.findByIdAndUpdate(
        stopIvanovoMinskId,
        updateStopIvanovoMinskDto,
        { new: true },
      );
    if (!existingStopIvanovoMinsk) {
      throw new NotFoundException(
        `StopIvanovoMinsk #${stopIvanovoMinskId} not found`,
      );
    }
    return existingStopIvanovoMinsk;
  }

  async getAll(): Promise<IStopIvanovoMinsk[]> {
    const stopIvanovoMinskData = await this.stopIvanovoMinskModel.find();
    if (!stopIvanovoMinskData || stopIvanovoMinskData.length == 0) {
      throw new NotFoundException('StopIvanovoMinsks data not found!');
    }
    return stopIvanovoMinskData;
  }

  async getById(stopIvanovoMinskId: string): Promise<IStopIvanovoMinsk> {
    const existingStopIvanovoMinsk = await this.stopIvanovoMinskModel
      .findById(stopIvanovoMinskId)
      .exec();
    if (!existingStopIvanovoMinsk) {
      throw new NotFoundException(
        `StopIvanovoMinsk #${stopIvanovoMinskId} not found`,
      );
    }
    return existingStopIvanovoMinsk;
  }

  async delete(stopIvanovoMinskId: string): Promise<IStopIvanovoMinsk> {
    const deletedStopIvanovoMinsk =
      await this.stopIvanovoMinskModel.findByIdAndDelete(stopIvanovoMinskId);
    if (!deletedStopIvanovoMinsk) {
      throw new NotFoundException(
        `StopIvanovoMinsk #${stopIvanovoMinskId} not found`,
      );
    }
    return deletedStopIvanovoMinsk;
  }
}
