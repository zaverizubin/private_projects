import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';
import { AnswerOption } from 'src/entities/answer-option.entity';
import { Question } from 'src/entities/question.entity';
import { AnswerOptionDocument } from 'src/schemas/answer-option.schema';
import { QuestionDocument } from 'src/schemas/question.schema';
import { QuestionOptionReqDto } from '../request/options.req.dto';
import { AnswerOptionRespDto } from './answer-option.resp.dto';

export class QuestionRespDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  score: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  sort_order: number;

  @ApiProperty({
    type: [AnswerOptionRespDto],
  })
  @IsNotEmpty()
  answer_options: AnswerOptionRespDto[];

  @ApiProperty({
    type: JSON,
  })
  options: QuestionOptionReqDto;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  shuffle_options: boolean;

  constructor(questionDocument: QuestionDocument, forAssessment: boolean) {
    this.id = questionDocument.id;
    this.type = questionDocument.type;
    this.text = questionDocument.text;
    this.score = questionDocument.score;
    this.options = {
      file_required: questionDocument.options.file_required,
      text_required: questionDocument.options.text_required,
    };
    this.sort_order = questionDocument.sort_order;
    this.shuffle_options = questionDocument.shuffle_options;
    this.answer_options = [];
    questionDocument.answerOptionDocuments.forEach(
      (answerOptionDocument: AnswerOptionDocument) => {
        this.answer_options.push(
          new AnswerOptionRespDto(answerOptionDocument, forAssessment),
        );
      },
    );
    this.answer_options = this.answer_options.sort((a, b) => a.id - b.id);

    if (questionDocument.shuffle_options) {
      this.answer_options = this.answer_options.sort(() => Math.random() - 0.5);
    }
  }
}
