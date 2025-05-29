import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollectionPermissionTypeService } from './collection-permission-type.service';
import { CreateCollectionPermissionTypeDto } from './dto/create-collection-permission-type.dto';
import { UpdateCollectionPermissionTypeDto } from './dto/update-collection-permission-type.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('collection-permission-type')
@Controller('collection-permission-type')
export class CollectionPermissionTypeController {
  constructor(private readonly collectionPermissionTypeService: CollectionPermissionTypeService) {}

  @Post()
  @ApiBody({ type: CreateCollectionPermissionTypeDto })
  create(@Body() createCollectionPermissionTypeDto: CreateCollectionPermissionTypeDto) {
    return this.collectionPermissionTypeService.create(createCollectionPermissionTypeDto);
  }

  @Get()
  findAll() {
    return this.collectionPermissionTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionPermissionTypeService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCollectionPermissionTypeDto })
  update(@Param('id') id: string, @Body() updateCollectionPermissionTypeDto: UpdateCollectionPermissionTypeDto) {
    return this.collectionPermissionTypeService.update(+id, updateCollectionPermissionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionPermissionTypeService.remove(+id);
  }
}
