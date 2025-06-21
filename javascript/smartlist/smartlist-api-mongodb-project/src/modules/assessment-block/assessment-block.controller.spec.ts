import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentBlockController } from './assessment-block.controller';
import { AssessmentBlockService } from './assessment-block.service';

describe('AssessmentBlockController', () => {
  let controller: AssessmentBlockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentBlockController],
      providers: [AssessmentBlockService],
    }).compile();

    controller = module.get<AssessmentBlockController>(
      AssessmentBlockController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
