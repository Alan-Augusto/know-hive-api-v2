import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAlternativeDto } from './create-alternative.dto';

export class UpdateAlternativeDto extends PartialType(OmitType(CreateAlternativeDto, ['question_id'] as const)){}
