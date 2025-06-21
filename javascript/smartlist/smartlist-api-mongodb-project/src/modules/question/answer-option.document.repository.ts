import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AnswerOption,
  AnswerOptionDocument,
} from 'src/schemas/answer-option.schema';

@Injectable()
export class AnswerOptionDocumentRepository {
  constructor(
    @InjectModel(AnswerOption.name)
    private answerOptionModel: Model<AnswerOptionDocument>,
  ) {}

  getModelInstance(): AnswerOptionDocument {
    return new this.answerOptionModel();
  }
}
