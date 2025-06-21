package com.smartlist.module.report.dto.response;

import com.smartlist.module.report.records.ReportData8;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TimeSeriesDataRespDTO {

    @Schema(description = "Date", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotEmpty
    final LocalDate date;

    @Schema(description = "Response rate", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    final Integer count;

    public TimeSeriesDataRespDTO(final ReportData8 data) {
        this.date = data.getDate();
        this.count = data.getCount();
    }


}
