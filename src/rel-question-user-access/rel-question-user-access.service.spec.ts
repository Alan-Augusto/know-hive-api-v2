import { Test, TestingModule } from '@nestjs/testing';
import { RelQuestionUserAccessService } from './rel-question-user-access.service';

describe('RelQuestionUserAccessService', () => {
  let service: RelQuestionUserAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelQuestionUserAccessService],
    }).compile();

    service = module.get<RelQuestionUserAccessService>(RelQuestionUserAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
