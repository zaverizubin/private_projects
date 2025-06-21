import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { AnswerOption } from 'src/entities/answer-option.entity';
import { Question } from 'src/entities/question.entity';
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

  constructor(question: Question, forAssessment: boolean) {
    this.id = question.id;
    this.type = question.type;
    this.text = question.text;
    this.score = question.score;
    this.options = question.options;
    this.sort_order = question.sortOrder;
    this.answer_options = [];
    question.answerOptions.forEach((answerOption: AnswerOption) => {
      this.answer_options.push(
        new AnswerOptionRespDto(answerOption, forAssessment),
      );
    });
  }
}
