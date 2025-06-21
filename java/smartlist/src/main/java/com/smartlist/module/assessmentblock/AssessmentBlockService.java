package com.smartlist.module.assessmentblock;

import com.smartlist.enums.AssessmentStatus;
import com.smartlist.model.Assessment;
import com.smartlist.model.AssessmentBlock;
import com.smartlist.module.assessment.AssessmentRepository;
import com.smartlist.module.assessmentblock.dto.request.AssessmentBlockReqDTO;
import com.smartlist.module.assessmentblock.dto.request.ReorderReqDTO;
import com.smartlist.module.assessmentblock.dto.response.AssessmentBlockRespDTO;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AssessmentBlockService {

    //Autowired
    final AssessmentRepository assessmentRepository;
    final AssessmentBlockRepository assessmentBlockRepository;

    //Global
    private final ModelMapper modelMapper;

    public AssessmentBlockService(final AssessmentRepository assessmentRepository, final AssessmentBlockRepository assessmentBlockRepository,
                                  final ModelMapper modelMapper){
        this.assessmentRepository = assessmentRepository;
        this.assessmentBlockRepository = assessmentBlockRepository;
        this.modelMapper = modelMapper;

        AssessmentBlockRespDTO.addEntityToDTOMappings(this.modelMapper);
    }

    public List<AssessmentBlockRespDTO> getAllByAssessmentId(final Integer assessmentId) {
        Optional<Assessment> optionalAssessment = this.assessmentRepository.findById(assessmentId);
        Assessment assessment = optionalAssessment.orElseThrow (this::throwIfAssessmentNotDefined);

        List<AssessmentBlock> assessmentBlocks = this.assessmentBlockRepository.findAllByAssessmentWithQuestions(assessment);
        List<AssessmentBlockRespDTO> assessmentBlockRespDTOS = new ArrayList<>();

        assessmentBlocks.forEach(assessmentBlock -> assessmentBlockRespDTOS.add(this.modelMapper.map(assessmentBlock, AssessmentBlockRespDTO.class)));
        return assessmentBlockRespDTOS;
    }


    public AssessmentBlockRespDTO getAssessmentBlockById(final Integer assessmentBlockId) {
        Optional<AssessmentBlock> optionalAssessmentBlock = this.assessmentBlockRepository.findByIdWithQuestions(assessmentBlockId);
        AssessmentBlock assessmentBlock = optionalAssessmentBlock.orElseThrow (this::throwIfAssessmentBlockNotDefined);

        return this.modelMapper.map(assessmentBlock, AssessmentBlockRespDTO.class);
    }

    public Integer createAssessmentBlock(final Integer assessmentId, final AssessmentBlockReqDTO assessmentBlockReqDto) {
        Optional<Assessment> optionalAssessment  = this.assessmentRepository.findById(assessmentId);
        Assessment assessment = optionalAssessment.orElseThrow (this::throwIfAssessmentNotDefined);

        throwIfAssessmentNotEditable(assessment);

        Integer sortOrder = this.assessmentBlockRepository.getMaxSortOrder(assessmentId);
        sortOrder = sortOrder != null ? sortOrder + 1 : 1;

        AssessmentBlock assessmentBlock  = this.modelMapper.map(assessmentBlockReqDto, AssessmentBlock.class);
        assessmentBlock.setAssessment(assessment);
        assessmentBlock.setSortOrder(sortOrder);

        this.assessmentBlockRepository.save(assessmentBlock);
        return assessmentBlock.getId();
    }

    public void updateAssessmentBlock(final Integer assessmentBlockId, final AssessmentBlockReqDTO assessmentBlockReqDto) {
        Optional<AssessmentBlock> optionalAssessmentBlock = this.assessmentBlockRepository.findById(assessmentBlockId);

        AssessmentBlock assessmentBlock = optionalAssessmentBlock.orElseThrow (this::throwIfAssessmentBlockNotDefined);
        throwIfAssessmentNotEditable(assessmentBlock.getAssessment());

        this.modelMapper.map(assessmentBlockReqDto, assessmentBlock);
        this.assessmentBlockRepository.save(assessmentBlock);
    }

    public void reorderAssessmentBlock(final Integer assessmentId, final ReorderReqDTO reorderReqDto) {
        Optional<Assessment> optionalAssessment =  this.assessmentRepository.findById(assessmentId);
        Assessment assessment = optionalAssessment.orElseThrow (this::throwIfAssessmentNotDefined);

        throwIfAssessmentNotEditable(assessment);

        if (reorderReqDto.getIds().isEmpty()) {
            throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_LIST;
        }

        List<AssessmentBlock> assessmentBlocks = this.assessmentBlockRepository.findAllByAssessment(assessment);

        if (assessmentBlocks.size() != reorderReqDto.getIds().size()) {
            throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_LIST;
        }

        assessmentBlocks.forEach(assessmentBlock -> {
            if (!reorderReqDto.getIds().contains(assessmentBlock.getId())) {
                throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_LIST;
            }
        });

        for(int i =0; i < reorderReqDto.getIds().size();i++){
            int id = reorderReqDto.getIds().get(i);
            Optional<AssessmentBlock> optionalAssessmentBlock = assessmentBlocks.stream().filter(ab -> ab.getId() == id).findFirst();
            if(optionalAssessmentBlock.isPresent()){
                optionalAssessmentBlock.get().setSortOrder(i + 1);
            }
        }
        this.assessmentBlockRepository.saveAll(assessmentBlocks);

    }

    @Transactional
    public void deleteAssessmentBlock(final Integer assessmentBlockId) {
        Optional<AssessmentBlock> optionalAssessmentBlock = this.assessmentBlockRepository.findById(assessmentBlockId);
        AssessmentBlock assessmentBlock = optionalAssessmentBlock.orElseThrow (this::throwIfAssessmentBlockNotDefined);

        this.throwIfAssessmentNotEditable(assessmentBlock.getAssessment());

        this.assessmentBlockRepository.delete(assessmentBlock);
        this.assessmentBlockRepository.updateSortOrder(assessmentBlock.getSortOrder(), assessmentBlock.getAssessment().getId());
    }


    private void throwIfAssessmentNotEditable(Assessment assessment) {
        if (assessment.getStatus() != AssessmentStatus.DRAFT) {
            throw AssessmentBlockResponseCodes.ASSESSMENT_ACTION_DENIED;
        }
    }

    private ResponseStatusException throwIfAssessmentBlockNotDefined() {
        return AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }

    private ResponseStatusException throwIfAssessmentNotDefined() {
        return AssessmentBlockResponseCodes.INVALID_ASSESSMENT_ID;
    }
}
