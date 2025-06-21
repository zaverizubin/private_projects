package com.smartlist.module.candidate.questionstrategy;

import com.smartlist.model.AssetFile;
import com.smartlist.model.Question;
import com.smartlist.module.candidate.CandidateResponseCodes;
import com.smartlist.module.candidate.dto.request.SubmitAnswerReqDTO;
import com.smartlist.module.file.FileRepository;
import com.smartlist.module.question.AnswerOptionRepository;
import com.smartlist.utils.RegexPatterns;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

public class VideoStrategy extends BaseQuestionStrategy{

    @Autowired
    private FileRepository fileRepository;

    public VideoStrategy(final SubmitAnswerReqDTO submitAnswerReqDto, final Question question,
                         final AnswerOptionRepository answerOptionRepository, final FileRepository fileRepository){
        super(submitAnswerReqDto, question, answerOptionRepository);
        this.fileRepository = fileRepository;
    }

    @Override
    public void validate() {
        if (!this.submitAnswerReqDto.getAnswerIds().isEmpty()) {
            throw CandidateResponseCodes.INVALID_ANSWER_ID;
        }

        AssetFile file;
        if (this.submitAnswerReqDto.getFileId() == null) {
            throw CandidateResponseCodes.INVALID_VIDEO_FILE_ID;
        }

        Optional<AssetFile> optionalAssetFile =  this.fileRepository.findById(this.submitAnswerReqDto.getFileId());
        file = optionalAssetFile.orElseThrow (() -> CandidateResponseCodes.INVALID_VIDEO_FILE_ID);

        if (!RegexPatterns.ALLOWED_VIDEO_FILE_EXTENSIONS.contains(file.getMimetype())) {
            throw CandidateResponseCodes.INVALID_FILE_TYPE;
        }
    }

    public int score() {
        return 0;
    }

}
