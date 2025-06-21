package com.smartlist.module.candidate.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.model.Assessment;
import com.smartlist.model.Organization;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
public class CandidateAssessmentIntroRespDTO {

    @Schema(description = "Candidate Assessment Logo", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @URL
    @NotBlank
    @JsonProperty(value="logo_url")
    String logoUrl;

    @Schema(description = "Candidate Assessment Organization Name", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @JsonProperty(value="org_name")
    String orgName;

    @Schema(description = "Candidate Assessment Organization About text", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @JsonProperty(value="org_about")
    String orgAbout;

    @Schema(description = "Candidate Assessment Introduction", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    @JsonProperty(value="assessment_intro")
    String assessmentIntro;

    @Schema(description = "Candidate Assessment Header Image URL", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @URL
    @JsonProperty(value="assessment_header_image_url")
    String assessmentHeaderImageUrl;

    @Schema(description = "Candidate Assessment Video URL", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    @URL
    @JsonProperty(value="assessment_video_link_url")
    String assessmentVideoLinkUrl;

    @Schema(description = "Position Assessed for", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotBlank
    String position;

    @Schema(description = "Count of Assessment Blocks", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @PositiveOrZero
    @JsonProperty(value="assessment_block_count")
    Integer assessmentBlockCount;

    @Schema(description = "Count of Questions", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @PositiveOrZero
    @JsonProperty(value="assessment_questions")
    Integer assessmentQuestionCount;

    public CandidateAssessmentIntroRespDTO(Organization organization, Assessment assessment, Integer assessmentBlockCount, Integer questionCount) {
        this.logoUrl = organization.getLogo() != null ? organization.getLogo().getUrl() : null;
        this.orgName = organization.getName();
        this.orgAbout = organization.getAbout();
        this.assessmentIntro = assessment.getIntroduction();
        this.assessmentVideoLinkUrl = assessment.getVideoLinkURL();
        this.assessmentHeaderImageUrl =
                assessment.getHeaderImage() != null ? assessment.getHeaderImage().getUrl() : null;
        this.position = assessment.getPosition();
        this.assessmentBlockCount = assessmentBlockCount;
        this.assessmentQuestionCount = questionCount;
    }


}
