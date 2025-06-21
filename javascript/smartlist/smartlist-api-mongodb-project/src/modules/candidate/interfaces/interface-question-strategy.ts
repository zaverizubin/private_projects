export interface IQuestionStrategy {
  validate();
  score(): number;
}
