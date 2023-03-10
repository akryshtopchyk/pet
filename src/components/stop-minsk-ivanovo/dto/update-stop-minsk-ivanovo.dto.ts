import { PartialType } from '@nestjs/mapped-types';
import { CreateStopMinskIvanovoDto } from './create-stop-minsk-ivanovo.dto';

export class UpdateStopMinskIvanovoDto extends PartialType(
  CreateStopMinskIvanovoDto,
) {}
