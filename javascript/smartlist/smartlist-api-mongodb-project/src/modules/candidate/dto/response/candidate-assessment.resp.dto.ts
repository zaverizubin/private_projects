import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CandidateAssessment } from 'src/entities/candidate-assessment.entity';
import { AssessmentDecision } from 'src/enums/assessment.decision';
import { CandidateAssessmentDocument } from 'src/schemas/candidate-assessment.schema';

export class CandidateAssessmentRespDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  candidate_id: string;

  @ApiProperty({
    type: String,
  })
  assessment_id: string;

  @ApiProperty({
    type: String,
  })
  active_assessment_block_id: string;

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

  constructor(candidateAssessmentDocument: CandidateAssessmentDocument) {
    this.id = candidateAssessmentDocument.id;
    this.candidate_id = candidateAssessmentDocument.candidateDocument.toString();
    this.assessment_id = candidateAssessmentDocument.assessmentDocument.toString();
    this.active_assessment_block_id = candidateAssessmentDocument.assessmentBlockDocument.toString();
    this.status = candidateAssessmentDocument.status;
    this.start_date = candidateAssessmentDocument.start_date;
    this.end_date = candidateAssessmentDocument.end_date;
    this.assessment_decision = candidateAssessmentDocument.assessment_decision;
  }
}
