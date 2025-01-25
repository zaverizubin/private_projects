package com.smartlist.module.report.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.enums.AssessmentDecision;
import com.smartlist.model.QuestionComment;
import com.smartlist.module.report.records.ReportData4;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;
import org.thymeleaf.context.Context;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class CandidateAssessmentReportRespDTO {

    @Schema(description = "Candidate Assessment start date", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @JsonProperty(value = "start_date")
    LocalDateTime startDate;

    @Schema(description = "Candidate Assessment end date", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @JsonProperty(value = "end_date")
    LocalDateTime endDate;

    @Schema(description = "Assessment decision", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @JsonProperty(value = "assessment_decision")
    AssessmentDecision assessmentDecision;

    @Schema(description = "Group Average score", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "group_average_score")
    Integer groupAverageScore;

    @Schema(description = "Candidate Average score", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "candidate_average_score")
    Integer candidateAverageScore;

    @Schema(description = "Assessment Block scores", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @JsonProperty(value = "assessment_block_scores")
    List<ReportData4> assessmentBlockScores;

    @Schema(description = "Overall score", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "overall_score")
    Integer overallScore;

    @Schema(description = "Assessment name", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    @JsonProperty(value = "assessment_name")
    String assessmentName;

    String candidateName;

    String candidateEmail;

    String candidateContactNumber;

    String candidatePhoto;

    File candidatePhotoFile;

    String organizationLogo;

    File organizationLogoFile;

    List<QuestionComment> questionComments;

    public void populateIntoTemplateContext(final Context context){
        context.setVariable("startDate", this.startDate.toLocalDate());
        context.setVariable("endDate", this.endDate.toLocalDate());
        context.setVariable("assessmentDecision", this.assessmentDecision.name());
        context.setVariable("groupAverageScore", this.groupAverageScore);
        context.setVariable("candidateAverageScore", this.candidateAverageScore);
        context.setVariable("assessmentBlockScores", this.assessmentBlockScores);
        context.setVariable("overallScore", this.overallScore);
        context.setVariable("assessmentName", this.assessmentName);
        context.setVariable("candidateName", this.candidateName);
        context.setVariable("candidateEmail", this.candidateEmail);
        context.setVariable("candidateContactNumber", this.candidateContactNumber);
        context.setVariable("candidatePhoto", this.candidatePhoto);
        context.setVariable("candidatePhotoFile", this.candidatePhotoFile);
        context.setVariable("organizationLogo", this.organizationLogo);
        context.setVariable("organizationLogoFile", this.organizationLogoFile);
        context.setVariable("questionComments", this.questionComments);
    }


}
