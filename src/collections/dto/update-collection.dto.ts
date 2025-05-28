import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateCollectionDto } from './create-collection.dto';

export class UpdateCollectionDto extends PartialType(OmitType(CreateCollectionDto, ['author_id'] as const)){}
