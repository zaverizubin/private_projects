package nexusglobal.wordprocessor.ui;

import com.vaadin.flow.component.Key;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.templatemodel.TemplateModel;
import nexusglobal.wordprocessor.config.PropertiesConfig;
import nexusglobal.wordprocessor.enums.SpringProfile;
import nexusglobal.wordprocessor.interfaces.Loggable;
import nexusglobal.wordprocessor.model.entities.User;
import nexusglobal.wordprocessor.ui.components.notifications.ErrorNotification;
import nexusglobal.wordprocessor.ui.shared.MainView;
import nexusglobal.wordprocessor.utils.ApmTheme;
import nexusglobal.wordprocessor.utils.NavigationController;
import nexusglobal.wordprocessor.utils.SecurityUtils;
import nexusglobal.wordprocessor.utils.StaticResources;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;

import java.util.Arrays;
import java.util.List;

@Tag("login-component")
@JsModule("./src/views/login-component.js")
@Route(value = "login", layout = MainView.class)
public class LoginView extends PolymerTemplate<LoginView.LoginComponentModel> implements Loggable {

    // Autowired Components
    private final SecurityUtils securityUtils;
    private final NavigationController navigationController;

    @Autowired
    PropertiesConfig propertiesConfig;

    @Autowired
    private Environment springEnvironment;

    // UI Components
    @Id("centerVLayout")
    private VerticalLayout centerVLayout;
    @Id("headerDiv")
    private Div headerDiv;
    @Id("emailAddressTextField")
    private TextField emailAddressTextField;
    @Id("passwordField")
    private PasswordField passwordField;
    @Id("loginButton")
    private Button loginButton;


    public interface LoginComponentModel extends TemplateModel {
        // Add setters and getters for template properties here.
        void setBackgroundImagePath(String backgroundImagePath);

        void setLogoImagePath(String logoImagePath);
    }

    // Global Variables
    public LoginView(final SecurityUtils securityUtils, final NavigationController navigationController) {
        super();
        this.securityUtils = securityUtils;
        this.navigationController = navigationController;

        buildUI();
    }

    private void buildUI() {
        setupTextFields();
        setupActionButtons();
        setupLayout();
    }

    private void setupTextFields() {
        this.headerDiv.setClassName(ApmTheme.DIALOG_HEADER_TEXT);

        this.emailAddressTextField.setClearButtonVisible(true);
        this.emailAddressTextField.setRequired(true);
        this.emailAddressTextField.setErrorMessage("Enter Username");
        this.emailAddressTextField.focus();

        this.passwordField.setRequired(true);
        this.passwordField.setErrorMessage("Enter Password");
    }

    private void setupActionButtons() {
        this.loginButton.setText("Login");
        this.loginButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        this.loginButton.addClassName(ApmTheme.CURSOR_POINTER);
        this.loginButton.addClickShortcut(Key.ENTER);
        this.loginButton.addClickListener(event -> doLogin());
    }

    private void setupLayout() {
        getModel().setBackgroundImagePath(StaticResources.LICENSING_APPLICATION_BACKGROUND);
        this.centerVLayout.setWidth("500px");
    }

    private boolean validateLoginFormInput() {
        final List<String> activeProfiles = Arrays.asList(this.springEnvironment.getActiveProfiles());
        if (activeProfiles.stream().anyMatch(profile -> profile.equalsIgnoreCase(SpringProfile.DEV.name()))
                && this.emailAddressTextField.getValue().isEmpty()
                && this.passwordField.getValue().isEmpty()) {
            this.emailAddressTextField.setValue(User.ADMIN_USERNAME);
            this.passwordField.setValue(User.ADMIN_DEFAULT_PASSWORD);
        }
        return !this.emailAddressTextField.isInvalid() && !this.passwordField.isInvalid();
    }

    private void navigateToView() {
        final DefaultSavedRequest savedRequest = this.securityUtils.getOriginalRequest();
        // If they were redirected to the login screen from a different view, then go back to that view, otherwise just load the default view
        if (savedRequest != null) {
            redirectToRequestedPage(savedRequest);
        } else {
            openDefaultView();
        }
    }

    private void redirectToRequestedPage(final DefaultSavedRequest savedRequest) {
        final String requestedURI = savedRequest.getRequestURI();
        final String[] splitURI = requestedURI.split("/", 3);

        final String adjustedURI = splitURI.length < 3 ? "" : splitURI[2];
        // If the adjustURI is less that 4 characters then it is most likely the root 'io/' so navigate to the default view
        if (adjustedURI.length() < 4) {
            openDefaultView();
        } else {
            getUI().ifPresent(ui -> ui.navigate(adjustedURI));
        }
    }

    private void openDefaultView() {
        this.navigationController.openView(DocumentView.class);
    }

    protected void doLogin() {
        try {
            boolean valid = validateLoginFormInput();
            if (valid) {
                this.securityUtils.login(this.emailAddressTextField.getValue(), this.passwordField.getValue());
                afterLogin();
            }
        } catch (final AuthenticationException ex) {
            logger().error("login failed for username {}, exception = ", this.emailAddressTextField.getValue(), ex);
            ErrorNotification.show(ex.getMessage());
        }
    }

    protected void afterLogin() {
        navigateToView();
    }
}
