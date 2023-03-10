import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStopMinskIvanovoDto } from './dto/create-stop-minsk-ivanovo.dto';
import { UpdateStopMinskIvanovoDto } from './dto/update-stop-minsk-ivanovo.dto';
import { IStopMinskIvanovo } from '../../interfaces/stop-minsk-ivanovo.interface';

@Injectable()
export class StopMinskIvanovoService {
  constructor(
    @InjectModel('StopMinskIvanovo')
    private stopMinskIvanovoModel: Model<IStopMinskIvanovo>,
  ) {}

  async create(
    createStopMinskIvanovoDto: CreateStopMinskIvanovoDto,
  ): Promise<IStopMinskIvanovo> {
    const newStopMinskIvanovo = await new this.stopMinskIvanovoModel(
      createStopMinskIvanovoDto,
    );
    return newStopMinskIvanovo.save();
  }

  async update(
    stopMinskIvanovoId: string,
    updateStopMinskIvanovoDto: UpdateStopMinskIvanovoDto,
  ): Promise<IStopMinskIvanovo> {
    const existingStopMinskIvanovo =
      await this.stopMinskIvanovoModel.findByIdAndUpdate(
        stopMinskIvanovoId,
        updateStopMinskIvanovoDto,
        { new: true },
      );
    if (!existingStopMinskIvanovo) {
      throw new NotFoundException(
        `StopMinskIvanovo #${stopMinskIvanovoId} not found`,
      );
    }
    return existingStopMinskIvanovo;
  }

  async getAll(): Promise<IStopMinskIvanovo[]> {
    const stopMinskIvanovoData = await this.stopMinskIvanovoModel.find();
    if (!stopMinskIvanovoData || stopMinskIvanovoData.length == 0) {
      throw new NotFoundException('StopMinskIvanovos data not found!');
    }
    return stopMinskIvanovoData;
  }

  async getById(stopMinskIvanovoId: string): Promise<IStopMinskIvanovo> {
    const existingStopMinskIvanovo = await this.stopMinskIvanovoModel
      .findById(stopMinskIvanovoId)
      .exec();
    if (!existingStopMinskIvanovo) {
      throw new NotFoundException(
        `StopMinskIvanovo #${stopMinskIvanovoId} not found`,
      );
    }
    return existingStopMinskIvanovo;
  }

  async delete(stopMinskIvanovoId: string): Promise<IStopMinskIvanovo> {
    const deletedStopMinskIvanovo =
      await this.stopMinskIvanovoModel.findByIdAndDelete(stopMinskIvanovoId);
    if (!deletedStopMinskIvanovo) {
      throw new NotFoundException(
        `StopMinskIvanovo #${stopMinskIvanovoId} not found`,
      );
    }
    return deletedStopMinskIvanovo;
  }
}
