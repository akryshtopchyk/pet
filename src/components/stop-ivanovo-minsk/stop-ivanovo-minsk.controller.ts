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
import { StopIvanovoMinskService } from './stop-ivanovo-minsk.service';
import { CreateStopIvanovoMinskDto } from './dto/create-stop-ivanovo-minsk.dto';
import { UpdateStopIvanovoMinskDto } from './dto/update-stop-ivanovo-minsk.dto';

@Controller('stop-ivanovo-minsk')
export class StopIvanovoMinskController {
  constructor(
    private readonly stopIvanovoMinskService: StopIvanovoMinskService,
  ) {}

  @Post()
  async createStopIvanovoMinsk(
    @Res() response,
    @Body() createStopIvanovoMinskDto: CreateStopIvanovoMinskDto,
  ) {
    try {
      const newStopIvanovoMinsk = await this.stopIvanovoMinskService.create(
        createStopIvanovoMinskDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'StopIvanovoMinsk has been created successfully',
        newStopIvanovoMinsk,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: StopIvanovoMinsk not created!',
        error: 'Bad Request',
      });
    }
  }

  @Put('/:id')
  async updateStopIvanovoMinsk(
    @Res() response,
    @Param('id') stopIvanovoMinskId: string,
    @Body() updateStopIvanovoMinskDto: UpdateStopIvanovoMinskDto,
  ) {
    try {
      const existingStopIvanovoMinsk =
        await this.stopIvanovoMinskService.update(
          stopIvanovoMinskId,
          updateStopIvanovoMinskDto,
        );
      return response.status(HttpStatus.OK).json({
        message: 'StopIvanovoMinsk has been successfully updated',
        existingStopIvanovoMinsk,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  async getStopIvanovoMinsks(@Res() response) {
    try {
      const stopIvanovoMinskData = await this.stopIvanovoMinskService.getAll();
      return response.status(HttpStatus.OK).json({
        message: 'All stopIvanovoMinsks data found successfully',
        stopIvanovoMinskData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getStopIvanovoMinsk(
    @Res() response,
    @Param('id') stopIvanovoMinskId: string,
  ) {
    try {
      const existingStopIvanovoMinsk =
        await this.stopIvanovoMinskService.getById(stopIvanovoMinskId);
      return response.status(HttpStatus.OK).json({
        message: 'StopIvanovoMinsk found successfully',
        existingStopIvanovoMinsk,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async deleteStopIvanovoMinsk(
    @Res() response,
    @Param('id') stopIvanovoMinskId: string,
  ) {
    try {
      const deletedStopIvanovoMinsk = await this.stopIvanovoMinskService.delete(
        stopIvanovoMinskId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'StopIvanovoMinsk deleted successfully',
        deletedStopIvanovoMinsk,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
