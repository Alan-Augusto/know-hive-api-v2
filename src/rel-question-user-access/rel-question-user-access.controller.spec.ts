import { Test, TestingModule } from '@nestjs/testing';
import { RelQuestionUserAccessController } from './rel-question-user-access.controller';
import { RelQuestionUserAccessService } from './rel-question-user-access.service';

describe('RelQuestionUserAccessController', () => {
  let controller: RelQuestionUserAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelQuestionUserAccessController],
      providers: [RelQuestionUserAccessService],
    }).compile();

    controller = module.get<RelQuestionUserAccessController>(RelQuestionUserAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
