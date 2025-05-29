import { Test, TestingModule } from '@nestjs/testing';
import { CollectionPermissionTypeController } from './collection-permission-type.controller';
import { CollectionPermissionTypeService } from './collection-permission-type.service';

describe('CollectionPermissionTypeController', () => {
  let controller: CollectionPermissionTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionPermissionTypeController],
      providers: [CollectionPermissionTypeService],
    }).compile();

    controller = module.get<CollectionPermissionTypeController>(CollectionPermissionTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
