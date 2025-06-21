package com.smartlist.module.user;

import com.smartlist.module.user.dto.request.*;
import com.smartlist.module.user.dto.response.UserRespDTO;
import com.smartlist.utils.AppResponseCodes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "User", description = "User API")
@RequestMapping(value ="/user/", produces = { "application/json" })
@Validated
@Secured({"SUPERADMIN", "ADMIN", "MEMBER"})
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @Operation(summary = "Create a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Integer.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.USER_EMAIL_ID_EXISTS_DESCRIPTION, content = @Content)
    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("create")
    public Integer create(@RequestBody @Valid CreateUserReqDTO createUserReqDto) {
        return this.userService.create(createUserReqDto);
    }

    @Operation(summary = "Create a new user from email invite")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Integer.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.TOKEN_EXPIRED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_TOKEN_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = UserResponseCodes.USER_EMAIL_ID_EXISTS_DESCRIPTION, content = @Content)
    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("create-from-invite")
    public Integer createFromInvite(@RequestBody @Valid CreateUserFromInviteReqDTO createUserFromInviteReqDto){
        return this.userService.createFromInvite(createUserFromInviteReqDto);
    }

    @Operation(summary = "Verify new user email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Integer.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.TOKEN_EXPIRED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_TOKEN_DESCRIPTION, content = @Content)
    })
    @PutMapping("verify-email")
    public void verifyEmail(@RequestParam(value = "token") @NotBlank String token) {
       this.userService.verifyUserEmail(token);
    }

    @Operation(summary = "Regenerate email verification")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content =  @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_USER_EMAIL_ID_DESCRIPTION, content = @Content)
    })
    @PutMapping("regenerate-verify-email")
    public void regenerateEmailVerification(@RequestBody @Valid RegenerateVerificationEmailReqDTO regenerateVerificationEmailReqDto) {
        this.userService.regenerateEmailVerification(regenerateVerificationEmailReqDto.getEmail());
    }

    @Operation(summary = "Forgot Password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content =  @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_USER_EMAIL_ID_DESCRIPTION, content = @Content)
    })
    @PostMapping("forgot-password")
    public void forgotPassword(@RequestBody @Valid ForgotPasswordReqDTO forgotPasswordReqDto) {
        this.userService.verifyAndSendForgotPasswordEmail(forgotPasswordReqDto.getEmail());
    }

    @Operation(summary = "Reset Forgot Password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content =  @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.TOKEN_EXPIRED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_TOKEN_DESCRIPTION, content = @Content)
    })
    @PostMapping("forgot-password-reset")
    public void forgotPasswordReset(@RequestBody @Valid ForgotPasswordResetReqDTO forgotPasswordResetReqDto) {
        this.userService.verifyAndResetPassword(forgotPasswordResetReqDto);
    }

    @Operation(summary = "Change password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content =  @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_PASSWORD_DESCRIPTION, content = @Content)
    })
    @PostMapping("{id}/change-password")
    public void changePassword(@PathVariable("id") @Positive Integer id, @RequestBody() @Valid ChangePasswordReqDTO changePasswordReqDto) {
        this.userService.changePassword(id, changePasswordReqDto);
    }

    @Operation(summary = "Get user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = UserRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_USER_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("{id}")
    public UserRespDTO findOne(@PathVariable("id") @Positive Integer id) {
        return this.userService.findUserById(id);
    }

    @Operation(summary = "Update user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content =  @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_PASSWORD_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_PROFILE_PHOTO_FILE_DESCRIPTION, content = @Content)
    })
    @PutMapping("{id}")
    public void update(@PathVariable("id") @Positive Integer id, @RequestBody() @Valid UpdateUserReqDTO updateUserReqDto) {
        this.userService.updateUser(id, updateUserReqDto);
    }

    @Operation(summary = "Toggle user's active status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content =  @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_USER_ID_DESCRIPTION, content = @Content)
    })
    @PatchMapping("{id}/active/{status}")
    public void setUserActive(@PathVariable("id") @Positive Integer userId, @PathVariable("status") @NotNull boolean status) {
        this.userService.toggleUserActive(userId, status);
    }

    @Operation(summary = "Update user's organization by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content =  @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_USER_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = UserResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content)
    })
    @PatchMapping("{id}/organization/{organizationId}")
    public void updateUserOrganization(@PathVariable("id") @Positive Integer id, @PathVariable("organizationId") @Positive Integer organizationId) {
        this.userService.updateUserOrganization(id, organizationId);
    }
}