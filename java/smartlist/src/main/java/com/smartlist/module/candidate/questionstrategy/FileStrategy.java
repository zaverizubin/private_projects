package com.smartlist.module.candidate.questionstrategy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartlist.model.AssetFile;
import com.smartlist.model.Question;
import com.smartlist.module.candidate.CandidateResponseCodes;
import com.smartlist.module.candidate.dto.request.SubmitAnswerReqDTO;
import com.smartlist.module.question.AnswerOptionRepository;
import com.smartlist.module.question.QuestionResponseCodes;
import com.smartlist.module.question.dto.request.QuestionOptionReqDTO;
import com.smartlist.module.file.FileRepository;
import com.smartlist.utils.RegexPatterns;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

public class FileStrategy extends BaseQuestionStrategy{

    @Autowired
    private FileRepository fileRepository;

    public FileStrategy(final SubmitAnswerReqDTO submitAnswerReqDto, final Question question,
                        final AnswerOptionRepository answerOptionRepository, final FileRepository fileRepository){
        super(submitAnswerReqDto, question, answerOptionRepository);
        this.fileRepository = fileRepository;
    }

    @Autowired
    public void  validate() {
        QuestionOptionReqDTO options = null;
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            options = objectMapper.readValue(this.question.getOptions(), QuestionOptionReqDTO.class);
        }catch (JsonProcessingException ex){
            //TODO
        }

        if (!this.submitAnswerReqDto.getAnswerIds().isEmpty()) {
            throw CandidateResponseCodes.INVALID_ANSWER_ID;
        }

        if (options != null  && options.getFileRequired()) {
            if (this.submitAnswerReqDto.getFileId() == null) {
                throw CandidateResponseCodes.INVALID_FILE_ID;
            }

            Optional<AssetFile> optionalAssetFile = this.fileRepository.findById(this.submitAnswerReqDto.getFileId());
            AssetFile file = optionalAssetFile.orElseThrow (this::throwIfFileNotDefined);

            if (!RegexPatterns.ALLOWED_FILE_EXTENSIONS.contains(file.getMimetype())) {
                throw CandidateResponseCodes.INVALID_FILE_TYPE;
            }

        }
        if (options != null  &&  options.getTextRequired() && StringUtils.isEmpty(this.submitAnswerReqDto.getAnswerText())) {
            throw QuestionResponseCodes.INVALID_ANSWER_TEXT;
        }
    }

    private ResponseStatusException throwIfFileNotDefined() {
        return  CandidateResponseCodes.INVALID_FILE_ID;
    }
    @Override
    public int score() {
        return 0;
    }
}
