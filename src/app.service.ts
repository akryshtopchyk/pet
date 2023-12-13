import { Injectable } from '@nestjs/common';
import { TripService } from './components/trip/trip.service';

@Injectable()
export class AppService {
  constructor(private readonly tripService: TripService) {}

  async delete() {
    await this.tripService.deleteOlder();
  }
}
