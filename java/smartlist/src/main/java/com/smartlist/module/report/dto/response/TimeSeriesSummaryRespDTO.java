package com.smartlist.module.report.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TimeSeriesSummaryRespDTO {

    @Schema(description = "Attempt details", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    final List<TimeSeriesDataRespDTO> attempts;

    @Schema(description = "Date details", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    final List<TimeSeriesDataRespDTO> submissions;

    public TimeSeriesSummaryRespDTO(final List<TimeSeriesDataRespDTO> attempts, final List<TimeSeriesDataRespDTO> submissions) {
        this.attempts = attempts;
        this.submissions = submissions;
    }


}
