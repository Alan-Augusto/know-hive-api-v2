import { Test, TestingModule } from '@nestjs/testing';
import { CollectionPermissionTypeService } from './collection-permission-type.service';

describe('CollectionPermissionTypeService', () => {
  let service: CollectionPermissionTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectionPermissionTypeService],
    }).compile();

    service = module.get<CollectionPermissionTypeService>(CollectionPermissionTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
