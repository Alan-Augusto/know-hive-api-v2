import { Test, TestingModule } from '@nestjs/testing';
import { RelCollectionUserAccessService } from './rel-collection-user-access.service';

describe('RelCollectionUserAccessService', () => {
  let service: RelCollectionUserAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelCollectionUserAccessService],
    }).compile();

    service = module.get<RelCollectionUserAccessService>(RelCollectionUserAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
