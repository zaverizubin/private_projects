import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentBlockService } from './assessment-block.service';

describe('AssessmentBlockService', () => {
  let service: AssessmentBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentBlockService],
    }).compile();

    service = module.get<AssessmentBlockService>(AssessmentBlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
