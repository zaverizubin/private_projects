package nexusglobal.wordprocessor.ui.components;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.shared.Registration;
import com.vaadin.flow.templatemodel.TemplateModel;
import nexusglobal.wordprocessor.exceptions.ValidationFailedException;
import nexusglobal.wordprocessor.interfaces.Loggable;
import nexusglobal.wordprocessor.ui.components.notifications.ErrorNotification;

import java.util.ArrayList;
import java.util.List;

@Tag("save-buttons-component")
@JsModule("./src/views/components/save-buttons-component.js")
public class SaveButtonsComponent extends PolymerTemplate<SaveButtonsComponent.SaveButtonsComponentModel> implements Loggable {

    // Autowired Components

    // Global Variables
    private final List<Registration> cancelButtonRegistrations = new ArrayList<>();
    private final List<Registration> saveButtonRegistrations = new ArrayList<>();
    // UI Components
    @Id("mainHLayout")
    private HorizontalLayout mainHLayout;
    @Id("cancelButton")
    private Button cancelButton;
    @Id("saveButton")
    private Button saveButton;
    @Id("saveAndCloseButton")
    private Button saveAndCloseButton;

    @FunctionalInterface
    public interface ValidationRunnable {
        void run() throws ValidationFailedException;
    }

    /**
     * This model binds properties between SaveButtonsComponent and save-buttons-component.html
     */
    public interface SaveButtonsComponentModel extends TemplateModel {

        void setCancelButtonText(String text);

        void setSaveButtonText(String text);

        void setSaveAndCloseButtonText(String text);
    }

    public SaveButtonsComponent() {
        super();
        setLabels();
    }

    private void setLabels() {
        getModel().setSaveButtonText("Save");
        getModel().setSaveAndCloseButtonText("Save & Close");
        getModel().setCancelButtonText("Cancel");
    }

    public void addCancelButtonClickListener(final Runnable listener) {
        final Registration registration = this.cancelButton.addClickListener(event -> listener.run());
        this.cancelButtonRegistrations.add(registration);
    }

    public void setCancelButtonClickListener(final Runnable listener) {
        for (final Registration registration : this.cancelButtonRegistrations) {
            registration.remove();
        }
        final Registration registration = this.cancelButton.addClickListener(event -> listener.run());
        this.cancelButtonRegistrations.add(registration);
    }

    public void addSaveButtonClickListener(final ValidationRunnable listener) {
        final Registration registration = this.saveButton.addClickListener(event -> {
            try {
                listener.run();
            } catch (final ValidationFailedException e) {
                logger().debug("", e);
                ErrorNotification.show(e.getMessage());
            }
        });
        this.saveButtonRegistrations.add(registration);
    }

    public void setSaveButtonClickListener(final ValidationRunnable listener) {

        for (final Registration registration : this.saveButtonRegistrations) {
            registration.remove();
        }
        final Registration registration = this.saveButton.addClickListener(event -> {
            try {
                listener.run();
            } catch (final ValidationFailedException e) {
                logger().debug("", e);
                ErrorNotification.show(e.getMessage());
            }
        });
        this.saveButtonRegistrations.add(registration);
    }

    public void addSaveAndCloseButtonClickListener(final ValidationRunnable listener) {
        this.saveAndCloseButton.addClickListener(event -> {
            try {
                listener.run();
            } catch (final ValidationFailedException e) {
                logger().debug("", e);
                ErrorNotification.show(e.getMessage());
            }
        });
    }

    public void setSaveButtonText(final String text) {
        getModel().setSaveButtonText(text);
    }

    public void setSaveAndCloseButtonText(final String text) {
        getModel().setSaveAndCloseButtonText(text);
    }

    public void setCancelButtonText(final String text) {
        getModel().setCancelButtonText(text);
    }

    public void hideSaveButton() {
        this.saveButton.setVisible(false);
    }

    public void hideSaveAndCloseButton() {
        this.saveAndCloseButton.setVisible(false);
    }

    public void hideSaveButtons() {
        hideSaveButton();
        this.saveAndCloseButton.setVisible(false);
    }

    public void disableSaveButton() {
        this.saveButton.setEnabled(false);
    }

    public void enableSaveButton() {
        this.saveButton.setEnabled(true);
    }

    public void enableSaveAndCloseButton() {
        this.saveAndCloseButton.setEnabled(true);
    }

    public void disableSaveAndCloseButton() {
        this.saveAndCloseButton.setEnabled(false);
    }

    public void enableSaveButtons() {
        enableSaveButton();
        enableSaveAndCloseButton();
    }

    public void disableSaveButtons() {
        disableSaveButton();
        disableSaveAndCloseButton();
    }

    public void showOnlySaveButton() {
        this.saveAndCloseButton.setVisible(false);
        this.cancelButton.setVisible(false);
    }

    public void showOnlySaveAndCloseButton() {
        this.saveButton.setVisible(false);
        this.cancelButton.setVisible(false);
    }

    public void setReadOnly(final boolean readOnly) {
        if (readOnly) {
            disableSaveButtons();
        }
    }

    public void addComponent(Component component) {
        this.mainHLayout.add(component);
    }

    @Override
    public void setVisible(final boolean visible) {
        if (visible) {
            getElement().getStyle().set("display", "block");
        } else {
            getElement().getStyle().set("display", "none");
        }
    }

}
