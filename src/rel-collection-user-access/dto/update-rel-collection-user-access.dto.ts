import { PartialType } from '@nestjs/swagger';
import { CreateRelCollectionUserAccessDto } from './create-rel-collection-user-access.dto';

export class UpdateRelCollectionUserAccessDto extends PartialType(CreateRelCollectionUserAccessDto) {}
