import { PartialType } from '@nestjs/swagger';
import { CreateRelQuestionCollectionDto } from './create-rel-question-collection.dto';

export class UpdateRelQuestionCollectionDto extends PartialType(CreateRelQuestionCollectionDto) {}
