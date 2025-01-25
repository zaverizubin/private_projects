package com.smartlist.module.auth;

import com.smartlist.module.auth.dto.request.AuthReqDTO;
import com.smartlist.module.auth.dto.request.JWTPayload;
import com.smartlist.module.auth.dto.response.AuthRespDTO;
import com.smartlist.module.candidate.CandidateResponseCodes;
import com.smartlist.module.candidate.CandidateService;
import com.smartlist.services.MockDataGeneratorService;
import com.smartlist.utils.AppResponseCodes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Auth", description = "Auth API")
@RequestMapping(value ="/auth/", produces = { "application/json" })
@ResponseStatus(HttpStatus.OK)
@Validated
public class AuthController {

    private final AuthService authService;
    private final CandidateService candidateService;
    private final MockDataGeneratorService mockDataGeneratorService;

    AuthController(final AuthService authService, final CandidateService candidateService, final MockDataGeneratorService mockDataGeneratorService){
        this.authService = authService;
        this.candidateService = candidateService;
        this.mockDataGeneratorService= mockDataGeneratorService;
    }

    @Operation(summary = "Login")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AuthRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = AuthResponseCodes.USER_CREDENTIALS_INVALID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "403", description = AuthResponseCodes.USER_ACCOUNT_INACTIVE_DESCRIPTION, content = @Content)
    })
    @PostMapping("login")
    public AuthRespDTO login(@RequestBody() @Valid AuthReqDTO authReqDto) {
        return this.authService.loginUser(authReqDto);
    }


    @Operation(summary = "Logout")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "401", description = AuthResponseCodes.ACCESS_TOKEN_INVALID_DESCRIPTION, content = @Content)
    })
    @DeleteMapping("logout")
    public void logout(HttpServletRequest request) {
        this.authService.logout(request);
    }


    @Operation(summary = "Verify OTP")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = AuthRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = CandidateResponseCodes.INVALID_VERIFICATION_CODE_DESCRIPTION, content = @Content)
    })
    @PatchMapping("candidate/{id}/login/{otp}")
    public AuthRespDTO verifyOTPAndLogin(@PathVariable("id") @Positive Integer id, @PathVariable("otp") @Positive Integer otp) {
        return this.candidateService.verifyCandidateOTPandLogin(id, otp);
    }

}
