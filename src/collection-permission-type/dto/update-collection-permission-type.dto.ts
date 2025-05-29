import { PartialType } from '@nestjs/swagger';
import { CreateCollectionPermissionTypeDto } from './create-collection-permission-type.dto';

export class UpdateCollectionPermissionTypeDto extends PartialType(CreateCollectionPermissionTypeDto) {}
