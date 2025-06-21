import { ApiProperty } from '@nestjs/swagger';
import { AssessmentDecision } from 'src/enums/assessment.decision';

export class CandidateAssessmentReportRespDto {
  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty()
  assessment_decision: AssessmentDecision;

  @ApiProperty()
  group_average_score: number;

  @ApiProperty()
  candidate_average_score: number;

  @ApiProperty()
  assessment_block_scores: any[];

  @ApiProperty()
  overall_score: number;

  @ApiProperty()
  assessment_name: string;
}
