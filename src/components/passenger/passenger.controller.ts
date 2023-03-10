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
import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Controller('passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post()
  async createPassenger(
    @Res() response,
    @Body() createPassengerDto: CreatePassengerDto,
  ) {
    try {
      const newPassenger = await this.passengerService.create(
        createPassengerDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'Passenger has been created successfully',
        newPassenger,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Passenger not created!',
        error: 'Bad Request',
      });
    }
  }

  @Put('/:id')
  async updatePassenger(
    @Res() response,
    @Param('id') passengerId: string,
    @Body() updatePassengerDto: UpdatePassengerDto,
  ) {
    try {
      const existingPassenger = await this.passengerService.update(
        passengerId,
        updatePassengerDto,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Passenger has been successfully updated',
        existingPassenger,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  async getPassengers(@Res() response) {
    try {
      const passengerData = await this.passengerService.getAll();
      return response.status(HttpStatus.OK).json({
        message: 'All passengers data found successfully',
        passengerData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:phoneNumber')
  async getPassenger(
    @Res() response,
    @Param('phoneNumber') phoneNumber: string,
  ) {
    try {
      const existingPassenger = await this.passengerService.getByPhoneNumber(
        phoneNumber,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Passenger found successfully',
        existingPassenger,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async deletePassenger(@Res() response, @Param('id') passengerId: string) {
    try {
      const deletedPassenger = await this.passengerService.delete(passengerId);
      return response.status(HttpStatus.OK).json({
        message: 'Passenger deleted successfully',
        deletedPassenger,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Post('/login')
  async login(@Res() response, @Body() passenger: any) {
    try {
      const existingPassenger = await this.passengerService.login(passenger);
      return response.status(HttpStatus.CREATED).json({
        existingPassenger,
      });
    } catch (err) {
      console.log(err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Passenger not created!',
        error: 'Bad Request',
      });
    }
  }

  @Post('/register')
  async register(@Res() response, @Body() passenger: any) {
    try {
      const newPassenger = await this.passengerService.register(passenger);
      return response.status(HttpStatus.CREATED).json({
        newPassenger,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Passenger not created!',
        error: 'Bad Request',
      });
    }
  }
}
