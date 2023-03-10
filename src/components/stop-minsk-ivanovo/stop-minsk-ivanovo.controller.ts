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
import { StopMinskIvanovoService } from './stop-minsk-ivanovo.service';
import { CreateStopMinskIvanovoDto } from './dto/create-stop-minsk-ivanovo.dto';
import { UpdateStopMinskIvanovoDto } from './dto/update-stop-minsk-ivanovo.dto';

@Controller('stop-minsk-ivanovo')
export class StopMinskIvanovoController {
  constructor(
    private readonly stopMinskIvanovoService: StopMinskIvanovoService,
  ) {}

  @Post()
  async createStopMinskIvanovo(
    @Res() response,
    @Body() createStopMinskIvanovoDto: CreateStopMinskIvanovoDto,
  ) {
    try {
      const newStopMinskIvanovo = await this.stopMinskIvanovoService.create(
        createStopMinskIvanovoDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'StopMinskIvanovo has been created successfully',
        newStopMinskIvanovo,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: StopMinskIvanovo not created!',
        error: 'Bad Request',
      });
    }
  }

  @Put('/:id')
  async updateStopMinskIvanovo(
    @Res() response,
    @Param('id') stopMinskIvanovoId: string,
    @Body() updateStopMinskIvanovoDto: UpdateStopMinskIvanovoDto,
  ) {
    try {
      const existingStopMinskIvanovo =
        await this.stopMinskIvanovoService.update(
          stopMinskIvanovoId,
          updateStopMinskIvanovoDto,
        );
      return response.status(HttpStatus.OK).json({
        message: 'StopMinskIvanovo has been successfully updated',
        existingStopMinskIvanovo,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  async getStopMinskIvanovos(@Res() response) {
    try {
      const stopMinskIvanovoData = await this.stopMinskIvanovoService.getAll();
      return response.status(HttpStatus.OK).json({
        message: 'All stopMinskIvanovos data found successfully',
        stopMinskIvanovoData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getStopMinskIvanovo(
    @Res() response,
    @Param('id') stopMinskIvanovoId: string,
  ) {
    try {
      const existingStopMinskIvanovo =
        await this.stopMinskIvanovoService.getById(stopMinskIvanovoId);
      return response.status(HttpStatus.OK).json({
        message: 'StopMinskIvanovo found successfully',
        existingStopMinskIvanovo,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async deleteStopMinskIvanovo(
    @Res() response,
    @Param('id') stopMinskIvanovoId: string,
  ) {
    try {
      const deletedStopMinskIvanovo = await this.stopMinskIvanovoService.delete(
        stopMinskIvanovoId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'StopMinskIvanovo deleted successfully',
        deletedStopMinskIvanovo,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
