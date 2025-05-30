import { Test, TestingModule } from '@nestjs/testing';
import { RelCollectionUserAccessController } from './rel-collection-user-access.controller';
import { RelCollectionUserAccessService } from './rel-collection-user-access.service';

describe('RelCollectionUserAccessController', () => {
  let controller: RelCollectionUserAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelCollectionUserAccessController],
      providers: [RelCollectionUserAccessService],
    }).compile();

    controller = module.get<RelCollectionUserAccessController>(RelCollectionUserAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
