import { Test, TestingModule } from '@nestjs/testing';
import { RelQuestionCollectionService } from './rel-question-collection.service';

describe('RelQuestionCollectionService', () => {
  let service: RelQuestionCollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelQuestionCollectionService],
    }).compile();

    service = module.get<RelQuestionCollectionService>(RelQuestionCollectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
