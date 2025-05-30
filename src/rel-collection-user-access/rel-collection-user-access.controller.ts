import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelCollectionUserAccessService } from './rel-collection-user-access.service';
import { CreateRelCollectionUserAccessDto } from './dto/create-rel-collection-user-access.dto';
import { UpdateRelCollectionUserAccessDto } from './dto/update-rel-collection-user-access.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('rel-collection-user-access')
@Controller('rel-collection-user-access')
export class RelCollectionUserAccessController {
  constructor(private readonly relCollectionUserAccessService: RelCollectionUserAccessService) {}

  @Post()
  @ApiBody({ type: CreateRelCollectionUserAccessDto })
  create(@Body() createRelCollectionUserAccessDto: CreateRelCollectionUserAccessDto) {
    return this.relCollectionUserAccessService.create(createRelCollectionUserAccessDto);
  }

  @Get()
  findAll() {
    return this.relCollectionUserAccessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relCollectionUserAccessService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateRelCollectionUserAccessDto })
  update(@Param('id') id: string, @Body() updateRelCollectionUserAccessDto: UpdateRelCollectionUserAccessDto) {
    return this.relCollectionUserAccessService.update(id, updateRelCollectionUserAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relCollectionUserAccessService.remove(id);
  }
}
