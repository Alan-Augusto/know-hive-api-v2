import { Test, TestingModule } from '@nestjs/testing';
import { RelQuestionCollectionController } from './rel-question-collection.controller';
import { RelQuestionCollectionService } from './rel-question-collection.service';

describe('RelQuestionCollectionController', () => {
  let controller: RelQuestionCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelQuestionCollectionController],
      providers: [RelQuestionCollectionService],
    }).compile();

    controller = module.get<RelQuestionCollectionController>(RelQuestionCollectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
