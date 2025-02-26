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
  Query,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  async createTrip(@Res() response, @Body() createTripDto: CreateTripDto) {
    try {
      const newTrip = await this.tripService.create(createTripDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Trip has been created successfully',
        newTrip,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Trip not created!',
        error: 'Bad Request',
      });
    }
  }

  @Put('/:id')
  async updateTrip(
    @Res() response,
    @Param('id') tripId: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    try {
      const existingTrip = await this.tripService.update(tripId, updateTripDto);
      return response.status(HttpStatus.OK).json({
        message: 'Trip has been successfully updated',
        existingTrip,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  async getTrips(@Res() response) {
    try {
      const tripData = await this.tripService.getAll();
      return response.status(HttpStatus.OK).json({
        message: 'All trips data found successfully',
        tripData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/gi')
  async getTripsGI(@Res() response) {
    try {
      const tripData = await this.tripService.getGIAll();
      return response.status(HttpStatus.OK).json({
        message: 'All trips data found successfully',
        tripData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/mi')
  async getTripsMI(@Res() response, @Query('isFull') isFull: string) {
    try {
      const tripData = await this.tripService.getMIAll(isFull);
      return response.status(HttpStatus.OK).json({
        message: 'All trips data found successfully',
        tripData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/history')
  async getHistoryTrips(@Res() response) {
    try {
      const tripData = await this.tripService.getHistory();
      return response.status(HttpStatus.OK).json({
        message: 'All trips data found successfully',
        tripData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/date/:date/:from')
  async getByDateAndFrom(
    @Res() response,
    @Param('date') date: string,
    @Param('from') from: string,
  ) {
    try {
      const tripData = await this.tripService.getByDate(date, from);
      return response.status(HttpStatus.OK).json({
        message: 'All trips data found successfully',
        tripData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/v2/date/:date/:from/:to')
  async getByDateAndFromV2(
    @Res() response,
    @Param('date') date: string,
    @Param('from') from: string,
    @Param('to') to: string,
  ) {
    try {
      const tripData = await this.tripService.getByDateV2(date, from, to);
      return response.status(HttpStatus.OK).json({
        message: 'All trips data found successfully',
        tripData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Post('/orders/:phoneNumber')
  async getTripsWithOrders(
    @Res() response,
    @Param('phoneNumber') number: string,
    @Body() ids: string[],
  ) {
    try {
      const tripData = await this.tripService.getTripsWithOrders(ids, number);
      return response.status(HttpStatus.OK).json({
        message: 'All trips data found successfully',
        tripData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getTrip(@Res() response, @Param('id') tripId: string) {
    try {
      const existingTrip = await this.tripService.getById(tripId);
      return response.status(HttpStatus.OK).json({
        message: 'Trip found successfully',
        existingTrip,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async deleteTrip(@Res() response, @Param('id') tripId: string) {
    try {
      const deletedTrip = await this.tripService.delete(tripId);
      return response.status(HttpStatus.OK).json({
        message: 'Trip deleted successfully',
        deletedTrip,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
