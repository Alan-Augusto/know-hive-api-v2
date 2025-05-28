import { Test, TestingModule } from '@nestjs/testing';
import { QuestionTypesService } from './question-types.service';

describe('QuestionTypesService', () => {
  let service: QuestionTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionTypesService],
    }).compile();

    service = module.get<QuestionTypesService>(QuestionTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
