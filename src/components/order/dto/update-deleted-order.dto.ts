import { PartialType } from '@nestjs/mapped-types';
import { CreateDeletedOrderDto } from './create-deleted-order.dto';

export class UpdateOrderDto extends PartialType(CreateDeletedOrderDto) {}
