import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CandidateResponseScore } from 'src/entities/candidate-response-score.entity';
import { CandidateResponseScoreDocument } from 'src/schemas/candidate-response-score.schema';
export class AssessmentQuestionScoreRespDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  candidate_id: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  assessment_id: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  assessment_block_id: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  question_id: string;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  score: number;

  constructor(candidateResponseScoreDocument: CandidateResponseScoreDocument) {
    this.candidate_id = candidateResponseScoreDocument.candidateDocument.toString();
    this.assessment_id = candidateResponseScoreDocument.assessmentDocument.toString();
    this.assessment_block_id = candidateResponseScoreDocument.assessmentBlockDocument.toString();
    this.question_id = candidateResponseScoreDocument.questionDocument.toString();
    this.score = candidateResponseScoreDocument.score;
  }
}
