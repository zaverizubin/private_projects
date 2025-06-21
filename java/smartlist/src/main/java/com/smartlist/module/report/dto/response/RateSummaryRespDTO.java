package com.smartlist.module.report.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RateSummaryRespDTO {

    @Schema(description = "Response rate", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "response_rate")
    final Long responseRate;

    @Schema(description = "Qualification rate", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "qualification_rate")
    final Long qualificationRate;

    @Schema(description = "SmartList rate", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "smart_list_rate")
    final Long smartlistRate;

    @Schema(description = "Registration count", example = "", requiredMode= Schema.RequiredMode.REQUIRED)
    @NotNull
    @PositiveOrZero
    @JsonProperty(value = "registration_count")
    final Long registrationCount;

    public RateSummaryRespDTO(final Long responseRate, final Long qualificationRate, final Long smartlistRate, final Long registrationCount) {
        this.responseRate = responseRate;
        this.qualificationRate = qualificationRate;
        this.smartlistRate = smartlistRate;
        this.registrationCount = registrationCount;
    }


}
