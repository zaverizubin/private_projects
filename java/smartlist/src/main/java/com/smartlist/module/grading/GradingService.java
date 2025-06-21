package com.smartlist.module.grading;

import com.smartlist.enums.AssessmentDecision;
import com.smartlist.enums.AssessmentStatus;
import com.smartlist.enums.CandidateAssessmentStatus;
import com.smartlist.enums.QuestionType;
import com.smartlist.model.*;
import com.smartlist.module.assessment.AssessmentRepository;
import com.smartlist.module.assessmentblock.AssessmentBlockRepository;
import com.smartlist.module.candidate.CandidateAssessmentRepository;
import com.smartlist.module.candidate.CandidateRepository;
import com.smartlist.module.candidate.CandidateResponseRepository;
import com.smartlist.module.candidate.interfaces.IQuestionStrategy;
import com.smartlist.module.grading.dto.request.QuestionCommentReqDTO;
import com.smartlist.module.grading.dto.request.QuestionScoreReqDTO;
import com.smartlist.module.grading.dto.response.AssessmentQuestionScoreRespDTO;
import com.smartlist.module.grading.dto.response.QuestionCommentRespDTO;
import com.smartlist.module.question.QuestionRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class GradingService {

    private final CandidateRepository candidateRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentBlockRepository assessmentBlockRepository;
    private final GradingRepository gradingRepository;
    private final QuestionRepository questionRepository;
    private final QuestionCommentRepository questionCommentRepository;
    private final CandidateResponseRepository candidateResponseRepository;
    private final CandidateAssessmentRepository candidateAssessmentRepository;
    private final ModelMapper modelMapper;

    public GradingService(final GradingRepository gradingRepository, final QuestionRepository questionRepository,
                          final QuestionCommentRepository questionCommentRepository, final CandidateResponseRepository candidateResponseRepository,
                          final CandidateAssessmentRepository candidateAssessmentRepository, final CandidateRepository candidateRepository,
                          final AssessmentRepository assessmentRepository, final AssessmentBlockRepository assessmentBlockRepository,
                          final ModelMapper modelMapper){
        this.gradingRepository = gradingRepository;
        this.questionRepository = questionRepository;
        this.questionCommentRepository = questionCommentRepository;
        this.candidateResponseRepository = candidateResponseRepository;
        this.candidateAssessmentRepository = candidateAssessmentRepository;
        this.candidateRepository = candidateRepository;
        this.assessmentRepository = assessmentRepository;
        this.assessmentBlockRepository = assessmentBlockRepository;
        this.modelMapper = modelMapper;
    }

    public List<AssessmentQuestionScoreRespDTO> getCandidateScoresByAssessment(final Integer candidateId, final Integer assessmentId) {
        Candidate candidate  = getCandidateByIdOrThrow(candidateId);
        Assessment assessment = getAssessmentByIdOrThrow(assessmentId);

        List<CandidateResponseScore> candidateResponseScores = this.gradingRepository.findByCandidateAndAssessment(candidate, assessment);
        List<AssessmentQuestionScoreRespDTO> assessmentQuestionScoreRespDTOs = new ArrayList<>();

        candidateResponseScores.forEach(candidateResponseScore -> assessmentQuestionScoreRespDTOs.add(this.modelMapper.map(candidateResponseScore, AssessmentQuestionScoreRespDTO.class)));
        return assessmentQuestionScoreRespDTOs;
    }

    public List<AssessmentQuestionScoreRespDTO> getCandidateScoresByAssessmentBlock(final Integer candidateId, final Integer assessmentBlockId) {
        Candidate candidate = getCandidateByIdOrThrow(candidateId);
        AssessmentBlock assessmentBlock = getAssessmentBlockByIdOrThrow(assessmentBlockId);

        List<CandidateResponseScore> candidateResponseScores = this.gradingRepository.findByCandidateAndAssessmentBlock(candidate, assessmentBlock);
        List<AssessmentQuestionScoreRespDTO> assessmentQuestionScoreRespDTOs = new ArrayList<>();

        candidateResponseScores.forEach(candidateResponseScore -> assessmentQuestionScoreRespDTOs.add(this.modelMapper.map(candidateResponseScore, AssessmentQuestionScoreRespDTO.class)));
        return assessmentQuestionScoreRespDTOs;
    }

    public List<Integer> getCandidateUnScoredQuestionsForAssessment(final Integer candidateId, final Integer assessmentId) {
        Candidate candidate = getCandidateByIdOrThrow(candidateId);
        Assessment assessment = getAssessmentByIdOrThrow(assessmentId);

        List<Question> questions = this.questionRepository.findByAssessment(assessment);

        List<CandidateResponseScore> candidateResponseScores = this.gradingRepository.findByCandidateAndAssessment(candidate, assessment);

        ArrayList<Integer> notScoredQuestionIds  = new ArrayList<>();
        for (Question question : questions) {
            if (question.getType() != QuestionType.TEXT_RESPONSE
                    && question.getType() != QuestionType.VIDEO_RESPONSE
                    && question.getType() != QuestionType.FILE_RESPONSE) {
                continue;
            }
            int id = question.getId();
            Optional<CandidateResponseScore> optionalCandidateResponseScore
                    = candidateResponseScores.stream().filter(crs -> crs.getQuestion().getId() == id).findFirst();
            if (optionalCandidateResponseScore.isEmpty()) {
                notScoredQuestionIds.add(question.getId());
            }
        }
        return notScoredQuestionIds;
    }

    public List<QuestionCommentRespDTO> getCandidateQuestionComments(final Integer candidateId, final Integer questionId) {
        Candidate candidate = getCandidateByIdOrThrow(candidateId);
        Question question = getQuestionByIdOrThrow(questionId);

        List<QuestionComment> questionComments = this.questionCommentRepository.findByCandidateAndQuestion(candidate, question);

        List<QuestionCommentRespDTO> questionCommentRespDTOS = new ArrayList<>();
        questionComments.forEach(questionComment -> questionCommentRespDTOS.add(this.modelMapper.map(questionComment, QuestionCommentRespDTO.class)));

        return questionCommentRespDTOS;
    }

    public void saveCandidateQuestionComment(final Integer candidateId, final Integer questionId, final QuestionCommentReqDTO questionCommentReqDto) {
        Candidate candidate = getCandidateByIdOrThrow(candidateId);
        Question question = getQuestionByIdOrThrow(questionId);

        QuestionComment questionComment = this.questionCommentRepository.findFirstByCandidateAndQuestionAndUsername(candidate, question, questionCommentReqDto.getUsername());
        if (questionComment != null) {
            questionComment.setComment(questionCommentReqDto.getComment());
        } else {
            questionComment = new QuestionComment();
            questionComment.setCandidate(candidate);
            questionComment.setQuestion(question);
            questionComment.setUsername(questionCommentReqDto.getUsername());
            questionComment.setComment(questionCommentReqDto.getComment());
        }

        this.questionCommentRepository.save(questionComment);
    }

    @Transactional
    public void saveCandidateResponseScore(final Integer candidateId, final QuestionScoreReqDTO questionScoreReqDto) {
        Candidate candidate = getCandidateByIdOrThrow(candidateId);
        Assessment assessment = getAssessmentByIdOrThrow(questionScoreReqDto.getAssessmentId());

        if (assessment.getStatus() != AssessmentStatus.ACTIVE) {
            throw GradingResponseCodes.ASSESSMENT_ACTION_DENIED;
        }

        Optional<Question> optionalQuestion = this.questionRepository.findById(questionScoreReqDto.getQuestionId());
        Question question = optionalQuestion.orElseThrow(() -> GradingResponseCodes.INVALID_QUESTION_ID);

        if (!Objects.equals(question.getAssessmentBlock().getAssessment().getId(), assessment.getId())) {
            throw GradingResponseCodes.INVALID_ASSESSMENT_ID;
        }

        CandidateResponseScore candidateResponseScore = new CandidateResponseScore(candidate, question);
        candidateResponseScore.setScore(questionScoreReqDto.getScore());

        this.gradingRepository.removeByCandidateAndQuestion(candidate, question);
        this.gradingRepository.save(candidateResponseScore);
    }

    public void markCandidateAssessmentGradingComplete(final Integer candidateId, final Integer assessmentId) {
        Candidate candidate = getCandidateByIdOrThrow(candidateId);
        Assessment assessment = getAssessmentByIdOrThrow(assessmentId);

        if (assessment.getStatus() != AssessmentStatus.ACTIVE) {
            throw GradingResponseCodes.ASSESSMENT_ACTION_DENIED;
        }

        Optional<CandidateAssessment> optionalCandidateAssessment = this.candidateAssessmentRepository.findByCandidateAndAssessment(candidate, assessment);
        CandidateAssessment candidateAssessment = optionalCandidateAssessment.orElseThrow(() -> GradingResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS);

        if (candidateAssessment.getStatus() != CandidateAssessmentStatus.GRADING_PENDING) {
            throw GradingResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
        }

        int countOfScoredResponses = this.gradingRepository.countByCandidateAndAssessment(candidate, assessment);
        int countOfResponses = this.candidateResponseRepository.countByCandidateAssessment(candidateAssessment);

        if (countOfScoredResponses != countOfResponses) {
            throw GradingResponseCodes.CANDIDATE_ASSESSMENT_SCORING_PENDING;
        }

        candidateAssessment.setStatus(CandidateAssessmentStatus.GRADING_COMPLETED);
        candidateAssessment.setEndDate(LocalDateTime.now());
        this.candidateAssessmentRepository.save(candidateAssessment);
    }

    public AssessmentDecision getCandidateAssessmentDecision(final Integer candidateId, final Integer assessmentId) {
        Candidate candidate = getCandidateByIdOrThrow(candidateId);
        Assessment assessment = getAssessmentByIdOrThrow(assessmentId);

        Optional<CandidateAssessment> optionalCandidateAssessment = this.candidateAssessmentRepository.findByCandidateAndAssessment(candidate, assessment);

        if (optionalCandidateAssessment.isEmpty()) {
            throw GradingResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
        }

        return optionalCandidateAssessment.get().getAssessmentDecision();
    }

    public void setCandidateAssessmentDecision(final Integer candidateId, final Integer assessmentId, final String decision) {
        Candidate candidate = getCandidateByIdOrThrow(candidateId);
        Assessment assessment = getAssessmentByIdOrThrow(assessmentId);

        if (assessment.getStatus() != AssessmentStatus.ACTIVE) {
            throw GradingResponseCodes.ASSESSMENT_ACTION_DENIED;
        }

        AssessmentDecision assessmentDecision;
        try {
            assessmentDecision = AssessmentDecision.valueOf(decision);
        }catch (IllegalArgumentException e){
            throw GradingResponseCodes.INVALID_ASSESSMENT_DECISION;
        }

        Optional<CandidateAssessment> optionalCandidateAssessment = this.candidateAssessmentRepository.findByCandidateAndAssessment(candidate, assessment);
        CandidateAssessment candidateAssessment = optionalCandidateAssessment.orElseThrow(() -> GradingResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS);

        if (candidateAssessment.getStatus() != CandidateAssessmentStatus.GRADING_COMPLETED) {
            throw GradingResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
        }

        candidateAssessment.setAssessmentDecision(assessmentDecision);
        this.candidateAssessmentRepository.save(candidateAssessment);
    }

    public void autoScoreAndSaveCandidateResponseScore(final Candidate candidate, final Question question, final IQuestionStrategy questionStrategy) {
        CandidateResponseScore candidateResponseScore = new CandidateResponseScore();
        candidateResponseScore.setCandidate(candidate);
        candidateResponseScore.setQuestion(question);
        candidateResponseScore.setAssessmentBlock(question.getAssessmentBlock());
        candidateResponseScore.setAssessment(question.getAssessmentBlock().getAssessment());
        candidateResponseScore.setScore(questionStrategy.score());

        this.gradingRepository.removeByCandidateAndQuestion(candidate, question);
        this.gradingRepository.save(candidateResponseScore);
    }

    private Candidate getCandidateByIdOrThrow(final Integer candidateId) {
        final Optional<Candidate> optionalCandidate = this.candidateRepository.findById(candidateId);
        return optionalCandidate.orElseThrow(() -> GradingResponseCodes.INVALID_CANDIDATE_ID);
    }

    private Question getQuestionByIdOrThrow(final Integer questionId) {
        final Optional<Question> optionalQuestion = this.questionRepository.findById(questionId);
        return optionalQuestion.orElseThrow(() -> GradingResponseCodes.INVALID_QUESTION_ID);
    }


    private AssessmentBlock getAssessmentBlockByIdOrThrow(final Integer assessmentBlockId) {
        final Optional<AssessmentBlock> optionalAssessmentBlock = this.assessmentBlockRepository.findById(assessmentBlockId);
        return optionalAssessmentBlock.orElseThrow(() -> GradingResponseCodes.INVALID_ASSESSMENT_BLOCK_ID);
    }

    private Assessment getAssessmentByIdOrThrow(final Integer id) {
        Optional<Assessment> optionalAssessment = this.assessmentRepository.findById(id);
        return optionalAssessment.orElseThrow (() -> GradingResponseCodes.INVALID_ASSESSMENT_ID);
    }
}
