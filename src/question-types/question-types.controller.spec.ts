import { Test, TestingModule } from '@nestjs/testing';
import { QuestionTypesController } from './question-types.controller';
import { QuestionTypesService } from './question-types.service';

describe('QuestionTypesController', () => {
  let controller: QuestionTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionTypesController],
      providers: [QuestionTypesService],
    }).compile();

    controller = module.get<QuestionTypesController>(QuestionTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
