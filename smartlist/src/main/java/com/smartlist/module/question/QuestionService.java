package com.smartlist.module.question;

import com.smartlist.enums.AssessmentStatus;
import com.smartlist.model.Assessment;
import com.smartlist.model.AssessmentBlock;
import com.smartlist.model.Question;
import com.smartlist.module.assessmentblock.AssessmentBlockRepository;
import com.smartlist.module.question.dto.request.QuestionReqDTO;
import com.smartlist.module.question.dto.request.ReorderReqDTO;
import com.smartlist.module.question.dto.response.QuestionRespDTO;
import com.smartlist.module.question.interfaces.IQuestionStrategy;
import com.smartlist.module.question.questionstrategy.QuestionStrategyFactory;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class QuestionService {

    private final AssessmentBlockRepository assessmentBlockRepository;
    private final QuestionRepository questionRepository;
    private final ModelMapper modelMapper;

    public QuestionService(final AssessmentBlockRepository assessmentBlockRepository,
                           final QuestionRepository questionRepository, final ModelMapper modelMapper){
        this.assessmentBlockRepository = assessmentBlockRepository;
        this.questionRepository = questionRepository;
        this.modelMapper = modelMapper;
    }

    public List<QuestionRespDTO> getAllByAssessmentBlockId(final Integer assessmentBlockId, final boolean forAssessment) {
        Optional<AssessmentBlock> optionalAssessmentBlock = this.assessmentBlockRepository.findById(assessmentBlockId);
        AssessmentBlock assessmentBlock = optionalAssessmentBlock.orElseThrow(() -> QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID);

        List<Question> questions = this.questionRepository.findByAssessmentBlockWithAnswers(assessmentBlock);
        List<QuestionRespDTO> questionRespDTOS = new ArrayList<>();

        questions.forEach(question -> {
            QuestionRespDTO questionRespDTO = this.modelMapper.map(question, QuestionRespDTO.class);
            questionRespDTO.getAnswerOptions().forEach(answerOptionRespDTO -> {
                if(forAssessment) answerOptionRespDTO.setCorrect(null);
            });
            questionRespDTOS.add(questionRespDTO);
        });
        return questionRespDTOS;
    }

    public QuestionRespDTO getQuestionById(final Integer questionId, final boolean forAssessment) {
        Optional<Question> optionalQuestion = this.questionRepository.findById(questionId);
        Question question = optionalQuestion.orElseThrow(() -> QuestionResponseCodes.INVALID_QUESTION_ID);

        QuestionRespDTO questionRespDTO = this.modelMapper.map(question, QuestionRespDTO.class);
        questionRespDTO.getAnswerOptions().forEach(answerOptionRespDTO -> {
            if(forAssessment) answerOptionRespDTO.setCorrect(null);
        });

        return questionRespDTO;
    }

    public Integer createQuestion(final Integer assessmentBlockId, final QuestionReqDTO questionReqDTO) {
        Optional<AssessmentBlock> optionalAssessmentBlock = this.assessmentBlockRepository.findById(assessmentBlockId);
        AssessmentBlock assessmentBlock = optionalAssessmentBlock.orElseThrow(() -> QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID);

        this.throwIfAssessmentNotEditable(assessmentBlock.getAssessment());

        IQuestionStrategy questionStrategy  = QuestionStrategyFactory.getQuestionStrategy(questionReqDTO);
        questionStrategy.validate();

        Integer sortOrder = this.questionRepository.getMaxSortOrder(assessmentBlockId);
        sortOrder = sortOrder != null ? sortOrder + 1 : 1;

        Question question = new Question(questionReqDTO);
        question.setAssessmentBlock(assessmentBlock);
        question.setSortOrder(sortOrder);

        this.questionRepository.save(question);

        return question.getId();
    }

    public void updateQuestion(final Integer questionId, final QuestionReqDTO questionReqDTO) {
        Question question = findQuestionById(questionId);
        throwIfAssessmentNotEditable(question.getAssessmentBlock().getAssessment());

        IQuestionStrategy questionStrategy = QuestionStrategyFactory.getQuestionStrategy(questionReqDTO);
        questionStrategy.validate();

        Question questionToUpdate = new Question(questionReqDTO);
        questionToUpdate.setId(questionId);
        questionToUpdate.setSortOrder(question.getSortOrder());
        questionToUpdate.setAssessmentBlock(question.getAssessmentBlock());
        this.questionRepository.save(questionToUpdate);
    }

    public void reorderQuestions(final Integer assessmentBlockId, final ReorderReqDTO reorderReqDTO) {
        Optional<AssessmentBlock> optionalAssessmentBlock = this.assessmentBlockRepository.findById(assessmentBlockId);
        AssessmentBlock assessmentBlock = optionalAssessmentBlock.orElseThrow(() -> QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID);

        throwIfAssessmentNotEditable(assessmentBlock.getAssessment());

        if (reorderReqDTO.getIds().isEmpty()) {
            throw QuestionResponseCodes.INVALID_QUESTION_ID_LIST;
        }

        List<Question> questions = this.questionRepository.findByAssessmentBlock(assessmentBlock);
        if (questions.size() != reorderReqDTO.getIds().size()) {
            throw QuestionResponseCodes.INVALID_QUESTION_ID_LIST;
        }

        questions.forEach(ab -> {
            if (!reorderReqDTO.getIds().contains(ab.getId())) {
                throw QuestionResponseCodes.INVALID_QUESTION_ID_LIST;
            }
        });

        for(int i = 0; i < reorderReqDTO.getIds().size(); i++){
            int index = i;
            Optional<Question> optionalQuestion = questions.stream().filter(ab -> Objects.equals(ab.getId(), reorderReqDTO.getIds().get(index))).findFirst();
            if (optionalQuestion.isPresent()) {
                optionalQuestion.get().setSortOrder(i + 1);
            }
        }

        this.questionRepository.saveAll(questions);
    }

    @Transactional
    public void deleteQuestion(final Integer questionId) {
        Question question = findQuestionById(questionId);

        throwIfAssessmentNotEditable(question.getAssessmentBlock().getAssessment());

        this.questionRepository.delete(question);
        this.questionRepository.updateSortOrder(question.getSortOrder(), question.getAssessmentBlock().getId());
    }

    private void throwIfAssessmentNotEditable(final Assessment assessment) {
        if(assessment.getStatus() != AssessmentStatus.DRAFT){
            throw QuestionResponseCodes.ASSESSMENT_ACTION_DENIED;
        }
    }

    private Question findQuestionById(final Integer questionId) {
        Optional<Question> optionalQuestion = this.questionRepository.findById(questionId);
        return optionalQuestion.orElseThrow (() -> QuestionResponseCodes.INVALID_QUESTION_ID);
    }
}
