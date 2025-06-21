import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.assessment.controller';
import { ReportService } from './report.assessment.service';

describe('ReportAssessmentController', () => {
  let controller: ReportAssessmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportAssessmentController],
      providers: [ReportAssessmentService],
    }).compile();

    controller = module.get<ReportAssessmentController>(ReportAssessmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
