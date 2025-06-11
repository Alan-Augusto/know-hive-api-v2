import { PartialType } from '@nestjs/swagger';
import { CreateRelQuestionUserAccessDto } from './create-rel-question-user-access.dto';

export class UpdateRelQuestionUserAccessDto extends PartialType(CreateRelQuestionUserAccessDto) {}
