package com.smartlist.module.organization;

import com.smartlist.module.organization.dto.request.OrganizationReqDTO;
import com.smartlist.module.organization.dto.request.InviteToOrganizationReqDTO;
import com.smartlist.module.organization.dto.request.OrganizationCancelInviteReqDTO;
import com.smartlist.module.organization.dto.response.OrganizationRespDTO;
import com.smartlist.module.organization.dto.response.OrganizationUserInviteListRespDTO;
import com.smartlist.module.organization.dto.response.OrganizationUserRespDTO;
import com.smartlist.utils.AppResponseCodes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Organization", description = "Organization API")
@RequestMapping(value ="/organization", produces = { "application/json" })
@ResponseStatus(HttpStatus.OK)
@Validated
@Secured({"SUPERADMIN", "ADMIN", "MEMBER"})
public class OrganizationController {

    private final OrganizationService organizationService;

    OrganizationController(final OrganizationService organizationService){
        this.organizationService = organizationService;
    }

    @Operation(summary = "Create an organization")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Integer.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = OrganizationResponseCodes.ORGANIZATION_NAME_EXISTS_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = OrganizationResponseCodes.INVALID_LOGO_FILE_ID_DESCRIPTION, content = @Content)
    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public Integer create(@RequestBody() @Valid OrganizationReqDTO createOrganizationDto) {
        return this.organizationService.createOrganization(createOrganizationDto);
    }

    @Operation(summary = "Update organization")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = OrganizationReqDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = OrganizationResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content)
    })
    @PutMapping("/{id}")
    public void update(@PathVariable("id") @Positive Integer id, @RequestBody() @Valid OrganizationReqDTO organizationReqDto) {
        this.organizationService.updateOrganization(id, organizationReqDto);
    }

    @Operation(summary = "Send email invites for signing up")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = OrganizationResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = OrganizationResponseCodes.INVALID_USER_ID_DESCRIPTION, content = @Content)
    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/{id}/invite")
    public void sendEmailInvites(
            @PathVariable("id") @Positive Integer id,
            @RequestBody() @Valid InviteToOrganizationReqDTO inviteToOrganizationReqDto) {
         this.organizationService.sendEmailInvites(id, inviteToOrganizationReqDto);
    }

    @Operation(summary = "Get organization")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = OrganizationRespDTO.class)) }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = OrganizationResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("/{id}")
    public OrganizationRespDTO findOne(@PathVariable("id") @Positive Integer id) {
        return this.organizationService.getByOrganizationId(id);
    }

    @Operation(summary = "Get organization users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = OrganizationUserRespDTO.class)))  }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = OrganizationResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("/{id}/users")
    public List<OrganizationUserRespDTO> getUsers(@PathVariable("id") @Positive Integer id) {
        return  this.organizationService.getOrganizationUsers(id);
    }

    @Operation(summary = "Get organization user invites")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = OrganizationUserRespDTO.class))  }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = OrganizationResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("/{id}/user-invites")
    public OrganizationUserInviteListRespDTO getUserInvites(@PathVariable("id") @Positive Integer id) {
        return this.organizationService.getUserInvites(id);
    }

    @Operation(summary = "Cancel invite to organization")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content =  @Content),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = OrganizationResponseCodes.INVALID_ORGANIZATION_ID_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = OrganizationResponseCodes.INVALID_USER_EMAIL_ID_DESCRIPTION, content = @Content)
    })
    @PutMapping("/{id}/cancel-invite")
    public void cancelInvite(
            @PathVariable("id") @Positive Integer id,
            @RequestBody() @Valid OrganizationCancelInviteReqDTO cancelInviteToOrganizationReqDto) {
        this.organizationService.cancelInviteToOrganization(id, cancelInviteToOrganizationReqDto);
    }

    @Secured({"SUPERADMIN"})
    @Operation(summary = "Get all organizations")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = OrganizationRespDTO.class)))  }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content)
    })
    @GetMapping()
    public List<OrganizationRespDTO> getAllOrganizations() {
        return this.organizationService.getAllOrganizations();
    }

}
