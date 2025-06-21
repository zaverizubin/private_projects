import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CandidateAssessment } from 'src/entities/candidate-assessment.entity';
import { AssessmentDecision } from 'src/enums/assessment.decision';

export class CandidateAssessmentRespDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  candidate_id: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  assessment_id: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  active_assessment_block_id: number;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    type: Date,
  })
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty({
    type: Date,
  })
  end_date: Date;

  @ApiProperty({
    type: String,
  })
  assessment_decision: AssessmentDecision;

  constructor(candidateAssessment: CandidateAssessment) {
    this.id = candidateAssessment.id;
    this.candidate_id = candidateAssessment.candidate.id;
    this.assessment_id = candidateAssessment.assessment.id;
    this.active_assessment_block_id = candidateAssessment.assessmentBlock.id;
    this.status = candidateAssessment.status;
    this.start_date = candidateAssessment.startDate;
    this.end_date = candidateAssessment.endDate;
    this.assessment_decision = candidateAssessment.assessmentDecision;
  }
}
