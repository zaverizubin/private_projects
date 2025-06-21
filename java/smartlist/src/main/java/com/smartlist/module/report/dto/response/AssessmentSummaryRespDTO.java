package com.smartlist.module.report.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartlist.module.report.records.ReportData5;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
public class AssessmentSummaryRespDTO {

    @Schema(description = "Assessment in progress count", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @PositiveOrZero
    final Integer id;

    @Schema(description = "Assessment in progress count", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    final String title;

    @Schema(description = "Assessment in progress count", example = "", requiredMode= Schema.RequiredMode.NOT_REQUIRED)
    final String department;

    @Schema(description = "Assessment in progress count", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @JsonProperty(value = "active_since")
    final LocalDate activeSince;

    @Schema(description = "Count of Registered assessments", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    final Long registered;

    @Schema(description = "Count of completed assessments", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    final Long completed;

    @Schema(description = "Count of smartListed assessments", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "smart_listed")
    final Long smartListed;

    public AssessmentSummaryRespDTO(final ReportData5 reportData5) {
        this.id = reportData5.getAssessmentId();
        this.title = reportData5.getTitle();
        this.department = reportData5.getDepartment();
        this.activeSince = reportData5.getActivatedOn();
        this.registered = reportData5.getRegistered();
        this.completed = reportData5.getCompleted();
        this.smartListed = reportData5.getSmartListed();
    }


}
