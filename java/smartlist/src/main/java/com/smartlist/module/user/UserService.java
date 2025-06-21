package com.smartlist.module.user;

import com.smartlist.enums.Role;
import com.smartlist.enums.TimeoutConfig;
import com.smartlist.model.*;
import com.smartlist.module.file.FileRepository;
import com.smartlist.module.organization.OrganizationRepository;
import com.smartlist.module.user.dto.request.*;
import com.smartlist.module.user.dto.response.UserRespDTO;
import com.smartlist.services.CryptoService;
import com.smartlist.module.email.EmailService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserEmailInviteRepository userEmailInviteRepository;
    private final UserEmailVerificationRepository userEmailVerificationRepository;
    private final UserForgotPasswordRepository userForgotPasswordRepository;
    private final OrganizationRepository organizationRepository;
    private final FileRepository fileRepository;
    private final CryptoService cryptoService;
    private final EmailService emailService;
    private final ModelMapper modelMapper;

    @Autowired
    private PlatformTransactionManager transactionManager;

    public UserService(final UserRepository userRepository, final UserEmailInviteRepository userEmailInviteRepository,
                       final UserEmailVerificationRepository userEmailVerificationRepository, final UserForgotPasswordRepository userForgotPasswordRepository,
                       final OrganizationRepository organizationRepository, final FileRepository fileRepository,
                       final CryptoService cryptoService, final EmailService emailService,
                       final ModelMapper modelMapper){
        this.userRepository = userRepository;
        this.userEmailInviteRepository = userEmailInviteRepository;
        this.userEmailVerificationRepository = userEmailVerificationRepository;
        this.userForgotPasswordRepository = userForgotPasswordRepository;
        this.organizationRepository = organizationRepository;
        this.fileRepository = fileRepository;
        this.cryptoService = cryptoService;
        this.emailService = emailService;
        this.modelMapper = modelMapper;

        UpdateUserReqDTO.addDTOToEntityMappings(this.modelMapper);
    }

    private TransactionTemplate getTransactionTemplate(){
        return new TransactionTemplate(this.transactionManager);
    }

    @Transactional
    public Integer create(final CreateUserReqDTO createUserReqDto) {
        throwIfEmailExists(createUserReqDto.getEmail());

        User user = this.modelMapper.map(createUserReqDto, User.class);
        user.setRole(Role.ADMIN);
        user.setPassword(this.cryptoService.generatePassword(user.getPassword()));
        user = this.userRepository.save(user);

        String token = this.cryptoService.generateToken();
        this.userEmailVerificationRepository.save(new UserEmailVerification(user, token));

        this.emailService.sendVerifyEmailMail(user.getEmail(), user.getName(), token);

        return user.getId();
    }


    public Integer createFromInvite(final CreateUserFromInviteReqDTO createUserFromInviteReqDTO) {
        Optional<UserEmailInvite> optionalUserEmailInvite = this.userEmailInviteRepository.findByToken(createUserFromInviteReqDTO.getToken());

        if (optionalUserEmailInvite.isEmpty()) {
            throw UserResponseCodes.INVALID_TOKEN;
        }
        UserEmailInvite userEmailInvite = optionalUserEmailInvite.get();
        if (TimeoutConfig.isExpired(userEmailInvite.getVersion(), TimeoutConfig.EMAIL_INVITE_LINK)) {
            getTransactionTemplate().execute(status -> {
                this.userEmailInviteRepository.deleteByToken(createUserFromInviteReqDTO.getToken());
                return 0;
            });
            throw UserResponseCodes.TOKEN_EXPIRED;
        }

        throwIfEmailExists(createUserFromInviteReqDTO.getEmail());

        return  getTransactionTemplate().execute(status -> {
            User user = this.modelMapper.map(createUserFromInviteReqDTO, User.class);
            user.setRole(Role.MEMBER);
            user.setPassword(this.cryptoService.generatePassword(user.getPassword()));
            user.setActive(true);
            user.setOrganization(userEmailInvite.getOrganization());
            user = this.userRepository.save(user);

            this.userEmailInviteRepository.deleteByToken(createUserFromInviteReqDTO.getToken());

            return user.getId();
        });
    }

    public void verifyUserEmail(final String verifyToken) {
        Optional<UserEmailVerification> optionalUserEmailVerification = this.userEmailVerificationRepository.findByToken(verifyToken);

        if (optionalUserEmailVerification.isEmpty()) {
            throw UserResponseCodes.INVALID_TOKEN;
        }
        UserEmailVerification userEmailVerification = optionalUserEmailVerification.get();

        if (TimeoutConfig.isExpired(userEmailVerification.getVersion(), TimeoutConfig.EMAIL_VERIFY_LINK)) {
            getTransactionTemplate().execute(status -> {
                this.userEmailVerificationRepository.deleteByToken(verifyToken);
                return 0;
            });
            throw UserResponseCodes.TOKEN_EXPIRED;
        } else {
            getTransactionTemplate().execute(status -> {
                this.userRepository.activateUser(userEmailVerification.getUser().getId());
                this.userEmailVerificationRepository.deleteByToken(verifyToken);
                return 0;
            });
        }
    }

    public void regenerateEmailVerification(final String emailId) {
        User user = getUserByEmailOrThrow(emailId);
        if (user.isActive()) {
            throw UserResponseCodes.USER_EMAIL_ALREADY_VERIFIED;
        }
        this.userEmailVerificationRepository.deleteByUser(user);

        String token = this.cryptoService.generateToken();
        this.userEmailVerificationRepository.save(new UserEmailVerification(user, token));

        this.emailService.sendVerifyEmailMail(user.getEmail(), user.getName(), token);
    }

    public void verifyAndSendForgotPasswordEmail(final String email) {
        Optional<User> optionalUser = this.userRepository.findByEmail(email);
        User user = optionalUser.orElseThrow(() -> UserResponseCodes.INVALID_USER_EMAIL_ID);

        Optional<UserForgotPassword> optionalUserForgotPassword = this.userForgotPasswordRepository.findByUser(user);

        optionalUserForgotPassword.ifPresent(this.userForgotPasswordRepository::delete);

        String token = this.cryptoService.generateToken();
        this.userForgotPasswordRepository.save(new UserForgotPassword(user, token));

        this.emailService.sendForgotPasswordMail(user.getEmail(), token);
    }

    public void verifyAndResetPassword(final ForgotPasswordResetReqDTO forgotPasswordResetReqDto) {
        Optional<UserForgotPassword> optionalUserForgotPassword = this.userForgotPasswordRepository.findByToken(forgotPasswordResetReqDto.getToken());
        if (optionalUserForgotPassword.isEmpty()) {
            throw UserResponseCodes.INVALID_TOKEN;
        }
        UserForgotPassword userForgotPassword = optionalUserForgotPassword.get();
        if (TimeoutConfig.isExpired(userForgotPassword.getVersion(), TimeoutConfig.FORGOT_PASSWORD_LINK)) {
            this.userForgotPasswordRepository.delete(userForgotPassword);
            throw UserResponseCodes.TOKEN_EXPIRED;
        } else {
            this.userForgotPasswordRepository.delete(userForgotPassword);

            User user = userForgotPassword.getUser();
            user.setPassword(this.cryptoService.generatePassword(forgotPasswordResetReqDto.getPassword()));
            this.userRepository.save(user);
        }
    }

    public void changePassword(final Integer userId, final ChangePasswordReqDTO changePasswordReqDto) {
        User user = getUserByIdOrThrow(userId);
        if (!this.cryptoService.comparePassword(changePasswordReqDto.getOldPassword(), user.getPassword())) {
            throw UserResponseCodes.INVALID_PASSWORD;
        }

        String newPassword = this.cryptoService.generatePassword(changePasswordReqDto.getNewPassword());
        user.setPassword(newPassword);
        this.userRepository.save(user);
    }

    public UserRespDTO findUserById(final Integer userId) {
        User user =  getUserByIdOrThrow(userId);
        return this.modelMapper.map(user, UserRespDTO.class);
    }

    public void updateUser(final Integer userId, final UpdateUserReqDTO updateUserReqDTO) {
        User user = getUserByIdOrThrow(userId);

        AssetFile photo = null;
        if (updateUserReqDTO.getPhotoId()!= null && updateUserReqDTO.getPhotoId()> 0) {
            Optional<AssetFile> optionalPhoto = this.fileRepository.findById(updateUserReqDTO.getPhotoId());
            photo = optionalPhoto.orElseThrow(() -> UserResponseCodes.INVALID_PROFILE_PHOTO_FILE_ID);
        }

        this.modelMapper.map(updateUserReqDTO, user);
        user.setPhoto(photo);

        this.userRepository.save(user);
    }

    public void toggleUserActive(final Integer userId, final Boolean status) {
        User user = this.getUserByIdOrThrow(userId);
        user.setActive(status);
        this.userRepository.save(user);
    }

    public void updateUserOrganization(final Integer userId, final Integer organizationId) {
        User user = this.getUserByIdOrThrow(userId);

        Optional<Organization> optionalOrganization = this.organizationRepository.findById(organizationId);
        Organization organization = optionalOrganization.orElseThrow(() -> UserResponseCodes.INVALID_ORGANIZATION_ID);

        user.setOrganization(organization);
        this.userRepository.save(user);
    }

    private void throwIfEmailExists(String emailId) {
        Optional<User> user  = this.userRepository.findByEmail(emailId);
        if (user.isPresent()) {
            throw UserResponseCodes.USER_EMAIL_ID_EXISTS;
        }
    }

    private User getUserByEmailOrThrow(String emailId){
        Optional<User> optionalUser = this.userRepository.findByEmail(emailId);
        if (optionalUser.isEmpty()) {
            throw UserResponseCodes.INVALID_USER_EMAIL_ID;
        }
        return optionalUser.get();
    }

    private User getUserByIdOrThrow(Integer userId) {
        Optional<User> optionalUser = this.userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw UserResponseCodes.INVALID_USER_ID;
        }
        return optionalUser.get();
    }

}
