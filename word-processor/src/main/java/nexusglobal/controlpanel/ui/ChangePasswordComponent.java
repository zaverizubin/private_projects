package nexusglobal.controlpanel.ui;

import com.vaadin.flow.component.ClickEvent;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.html.Label;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.templatemodel.TemplateModel;
import nexusglobal.controlpanel.exceptions.ValidationFailedException;
import nexusglobal.controlpanel.model.entities.User;
import nexusglobal.controlpanel.service.UserService;
import nexusglobal.controlpanel.ui.components.CloseableDialog;
import nexusglobal.controlpanel.ui.components.notifications.ErrorNotification;
import nexusglobal.controlpanel.ui.components.notifications.SavedNotification;
import nexusglobal.controlpanel.utils.SecurityUtils;
import nexusglobal.controlpanel.utils.ValidationUtils;
import org.apache.shiro.authc.credential.PasswordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;


@SuppressWarnings("unused")
@Tag("change-password-component")
@JsModule("./src/views/change-password-component.js")
@Component
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class ChangePasswordComponent extends PolymerTemplate<ChangePasswordComponent.ChangePasswordComponentModel> {
    private static final long serialVersionUID = 1L;

    private static final Logger LOGGER = LoggerFactory.getLogger(ChangePasswordComponent.class);
    private static final String CURRENT_PASSWORD_INCORRECT = "Current password is incorrect";
    private static final String PASSWORD_MATCH_ERROR_MESSAGE = "New and Confirm new passwords should match.";
    private static final String PASSWORD_FORMAT_ERROR_MESSAGE = "Password must match the stated requirement.";

    // Autowired
    @Autowired
    private SecurityUtils securityUtils;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordService passwordService;


    // UI Components
    @Id("centerVerticalLayout")
    private VerticalLayout centerVerticalLayout;
    @Id("passwordResetInstruction")
    private Label passwordResetInstruction;
    @Id("currentPasswordField")
    private PasswordField currentPasswordField;
    @Id("newPasswordField")
    private PasswordField newPasswordField;
    @Id("confirmNewPasswordField")
    private PasswordField confirmNewPasswordField;
    @Id("changePasswordButton")
    private Button changePasswordButton;

    // Global
    private CloseableDialog dialog;
    private boolean isServiceUser = false;

    public interface ChangePasswordComponentModel extends TemplateModel {

    }

    public ChangePasswordComponent() {
        super();

        buildUI();
    }

    private void buildUI() {
        setupTextFields();
        setupActionButtons();
    }

    private void setupTextFields() {
        this.currentPasswordField.setRequired(true);
        this.currentPasswordField.setLabel("Current Password");

        this.newPasswordField.setRequired(true);
        this.newPasswordField.setLabel("New Password");

        this.confirmNewPasswordField.setRequired(true);
        this.confirmNewPasswordField.setLabel("Confirm New Password");

        this.passwordResetInstruction.setText("Password must consist of a minimum of 8 characters and combination of at least one alphabet and one numeric character.");
    }

    private void setupActionButtons() {
        this.changePasswordButton.setText("Change Password");
        this.changePasswordButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        this.changePasswordButton.addClickListener(this::onChangePasswordClick);
    }

    private void clearFields() {
        this.currentPasswordField.clear();
        this.newPasswordField.clear();
        this.confirmNewPasswordField.clear();
    }

    private void onChangePasswordClick(ClickEvent<Button> listener) {
        try {
            save();
            SavedNotification.show("Password changed successfully.");
        } catch (ValidationFailedException ex) {
            ErrorNotification.show("Validation Error", ex.getMessage());
            return;
        } catch (Exception ex) {
            LOGGER.error("Error changing password", ex);
            ErrorNotification.show("", "An error occured when attempting to change the password.");
            return;
        }
        this.dialog.close();
    }

    private void save() throws ValidationFailedException {
        final String oldPassword = this.currentPasswordField.getValue();
        final String newPassword = this.newPasswordField.getValue();
        final String confirmNewPassword = this.confirmNewPasswordField.getValue();

        final User currentUser = this.isServiceUser ? this.userService.getDao().findByUsername(User.SERVICE_USERNAME).orElse(null) :
                this.securityUtils.getCurrentUser();

        if (currentUser != null && !this.passwordService.passwordsMatch(oldPassword, currentUser.getHashedPassword())) {
            throw new ValidationFailedException(CURRENT_PASSWORD_INCORRECT);
        }

        if (!ValidationUtils.isValidPassword(newPassword)) {
            throw new ValidationFailedException(PASSWORD_FORMAT_ERROR_MESSAGE);
        }

        if (!newPassword.equals(confirmNewPassword)) {
            throw new ValidationFailedException(PASSWORD_MATCH_ERROR_MESSAGE);
        }

        if (currentUser != null) {
            currentUser.setPlainPassword(newPassword);
            this.userService.updateEntity(currentUser);
        }
    }

    public void showInDialog(boolean isServiceUser) {
        this.isServiceUser = isServiceUser;

        clearFields();

        this.dialog = new CloseableDialog();
        this.dialog.setWidth("500px");
        this.dialog.setHeight("500px");
        this.dialog.add(this);
        this.dialog.open();
        this.dialog.addHeader(this.isServiceUser ? "Change Service User Password" : "Change Password");
    }


}