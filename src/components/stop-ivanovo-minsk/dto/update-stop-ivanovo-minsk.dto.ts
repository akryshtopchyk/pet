import { PartialType } from '@nestjs/mapped-types';
import { CreateStopIvanovoMinskDto } from './create-stop-ivanovo-minsk.dto';

export class UpdateStopIvanovoMinskDto extends PartialType(
  CreateStopIvanovoMinskDto,
) {}
