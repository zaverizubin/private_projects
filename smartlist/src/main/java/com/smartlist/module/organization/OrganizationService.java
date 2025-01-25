package com.smartlist.module.organization;

import com.smartlist.model.AssetFile;
import com.smartlist.model.Organization;
import com.smartlist.model.User;
import com.smartlist.model.UserEmailInvite;
import com.smartlist.module.file.FileRepository;
import com.smartlist.module.organization.dto.request.OrganizationReqDTO;
import com.smartlist.module.organization.dto.request.InviteToOrganizationReqDTO;
import com.smartlist.module.organization.dto.request.OrganizationCancelInviteReqDTO;
import com.smartlist.module.organization.dto.response.OrganizationRespDTO;
import com.smartlist.module.organization.dto.response.OrganizationUserInviteListRespDTO;
import com.smartlist.module.organization.dto.response.OrganizationUserRespDTO;
import com.smartlist.module.user.UserEmailInviteRepository;
import com.smartlist.module.user.UserRepository;
import com.smartlist.services.CryptoService;
import com.smartlist.module.email.EmailService;
import org.apache.commons.lang3.ObjectUtils;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final UserEmailInviteRepository userEmailInviteRepository;
    private final CryptoService cryptoService;
    private final EmailService emailService;
    private final ModelMapper modelMapper;

    public OrganizationService(final OrganizationRepository organizationRepository, final FileRepository fileRepository,
                               final UserRepository userRepository, final UserEmailInviteRepository userEmailInviteRepository,
                               final CryptoService cryptoService, final EmailService emailService,
                               final ModelMapper modelMapper){
        this.organizationRepository = organizationRepository;
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.userEmailInviteRepository = userEmailInviteRepository;
        this.cryptoService = cryptoService;
        this.emailService = emailService;
        this.modelMapper = modelMapper;

        OrganizationReqDTO.addDTOToEntityMappings(this.modelMapper);
        OrganizationRespDTO.addEntityToDTOMappings(this.modelMapper);

    }


    public Integer createOrganization(final OrganizationReqDTO organizationReqDTO) {
        Optional<Organization> optionalOrganization  = this.organizationRepository.findByName(organizationReqDTO.getName());
        if(optionalOrganization.isPresent()){
            throw OrganizationResponseCodes.ORGANIZATION_NAME_EXISTS;
        }
        AssetFile logo = null;
        if (ObjectUtils.defaultIfNull(organizationReqDTO.getLogoId(), 0)  > 0) {
            Optional<AssetFile> optionalLogo = this.fileRepository.findById(organizationReqDTO.getLogoId());
            logo = optionalLogo.orElseThrow(() ->OrganizationResponseCodes.INVALID_LOGO_FILE_ID) ;
        }

        Organization organization = this.modelMapper.map(organizationReqDTO, Organization.class);
        organization.setLogo(logo);
        return this.organizationRepository.save(organization).getId();
    }

    public void updateOrganization(final Integer organizationId, final OrganizationReqDTO organizationReqDTO) {
        Optional<Organization> optionalOrganization = this.organizationRepository.findByName(organizationReqDTO.getName());

        if (optionalOrganization.isPresent() && !Objects.equals(optionalOrganization.get().getId(), organizationId)) {
            throw OrganizationResponseCodes.ORGANIZATION_NAME_EXISTS;
        }

        Organization organization = findOrganizationByIdOrThrow(organizationId);
        if (organization == null) {
            throw OrganizationResponseCodes.INVALID_ORGANIZATION_ID;
        }
        AssetFile logo = null;
        if (ObjectUtils.defaultIfNull(organizationReqDTO.getLogoId(), 0)  > 0) {
            Optional<AssetFile> optionalLogo = this.fileRepository.findById(organizationReqDTO.getLogoId());
            logo = optionalLogo.orElseThrow(() ->OrganizationResponseCodes.INVALID_LOGO_FILE_ID) ;
        }

        this.modelMapper.map(organizationReqDTO,organization);
        organization.setLogo(logo);
        this.organizationRepository.save(organization);
    }

    public OrganizationRespDTO getByOrganizationId(final Integer organizationId) {
        Optional<Organization> optionalOrganization = this.organizationRepository.findById(organizationId);
        if (optionalOrganization.isEmpty()) {
            throw OrganizationResponseCodes.INVALID_ORGANIZATION_ID;
        }

        return this.modelMapper.map(optionalOrganization.get(), OrganizationRespDTO.class);
    }

    public List<OrganizationRespDTO> getAllOrganizations() {
        List<Organization> organizations = this.organizationRepository.findAll();
        List<OrganizationRespDTO> organizationRespDTOs = new ArrayList<>();

        organizations.forEach(organization -> organizationRespDTOs.add(this.modelMapper.map(organization, OrganizationRespDTO.class)));
        return organizationRespDTOs;
    }

    public List<OrganizationUserRespDTO> getOrganizationUsers(final Integer organizationId) {
        Organization organization = findOrganizationByIdOrThrow(organizationId);
        ArrayList<OrganizationUserRespDTO> orgUsersRespDTOs = new ArrayList<>();

        List<User> users =  this.userRepository.findByOrganization(organization);
        users.forEach(user -> orgUsersRespDTOs.add(this.modelMapper.map(user, OrganizationUserRespDTO.class)));

        return orgUsersRespDTOs;
    }

    public void sendEmailInvites(final Integer organizationId, final InviteToOrganizationReqDTO inviteToOrganizationReqDto) {
        Organization organization = findOrganizationByIdOrThrow(organizationId);

        Optional<User> optionalUserInvitee  = this.userRepository.findById(inviteToOrganizationReqDto.getUserId());
        if (optionalUserInvitee.isEmpty()) {
            throw OrganizationResponseCodes.INVALID_USER_ID;
        }

        for (int i = 0; i < inviteToOrganizationReqDto.getEmails().size(); i++) {
            String emailId = inviteToOrganizationReqDto.getEmails().get(i);
            Optional<User> optionalUser = this.userRepository.findByEmail(emailId);
            if (optionalUser.isPresent()) {
                continue;
            }
            Optional<UserEmailInvite> optionalExistingUserEmailInvite  = this.userEmailInviteRepository.findByEmail(emailId);
            if (optionalExistingUserEmailInvite.isPresent()) {
                continue;
            }

            UserEmailInvite userEmailInvite = new UserEmailInvite();
            userEmailInvite.setEmail(emailId);
            userEmailInvite.setOrganization(organization);
            userEmailInvite.setToken(this.cryptoService.generateToken());
            this.userEmailInviteRepository.save(userEmailInvite);

            this.emailService.sendInviteToAppMail(emailId, optionalUserInvitee.get().getName(), userEmailInvite.getToken());
        }
    }

    public OrganizationUserInviteListRespDTO getUserInvites(final Integer organizationId){
        Organization organization = findOrganizationByIdOrThrow(organizationId);
        List<UserEmailInvite> userEmailInvites = this.userEmailInviteRepository.findByOrganization(organization);

        return new OrganizationUserInviteListRespDTO(userEmailInvites);
    }

    public void cancelInviteToOrganization(final Integer organizationId, final OrganizationCancelInviteReqDTO cancelInviteToOrganizationReqDto) {
        Organization organization = findOrganizationByIdOrThrow(organizationId);
        Optional<UserEmailInvite> optionalUserEmailInvite = this.userEmailInviteRepository.findByEmailAndOrganization(cancelInviteToOrganizationReqDto.getEmail(), organization);
        if (optionalUserEmailInvite.isEmpty()) {
            throw OrganizationResponseCodes.INVALID_USER_EMAIL_ID;
        }
        this.userEmailInviteRepository.delete(optionalUserEmailInvite.get());
    }


    private Organization findOrganizationByIdOrThrow(final Integer organizationId) {
        Optional<Organization> optionalOrganization = this.organizationRepository.findById(organizationId);
        return optionalOrganization.orElseThrow (() -> OrganizationResponseCodes.INVALID_ORGANIZATION_ID);
    }
}
