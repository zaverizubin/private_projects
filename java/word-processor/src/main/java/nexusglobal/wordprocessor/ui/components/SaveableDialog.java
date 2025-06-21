package nexusglobal.wordprocessor.ui.components;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import nexusglobal.wordprocessor.exceptions.ValidationFailedException;
import nexusglobal.wordprocessor.interfaces.Loggable;
import nexusglobal.wordprocessor.interfaces.Saveable;
import nexusglobal.wordprocessor.ui.components.notifications.ErrorNotification;
import nexusglobal.wordprocessor.ui.components.notifications.SavedNotification;
import nexusglobal.wordprocessor.utils.ApmTheme;


public class SaveableDialog extends Dialog implements Loggable {

    // Global Variables
    private final HorizontalLayout headerHLayout = new HorizontalLayout();
    private final SaveButtonsComponent saveButtonsComponent = new SaveButtonsComponent();
    private Runnable onCloseRunnable;

    public <T extends Component & Saveable> SaveableDialog(T saveable) {

        this.saveButtonsComponent.addSaveButtonClickListener(() -> {
            try {
                saveable.save();
                SavedNotification.show();
            } catch (final ValidationFailedException e) {
                ErrorNotification.show(getTranslation("Validation Failed"), e.getMessage());
            }

        });
        this.saveButtonsComponent.addCancelButtonClickListener(() -> {
            if (this.onCloseRunnable != null) {
                this.onCloseRunnable.run();
            }
            this.close();
        });
        this.saveButtonsComponent.addSaveAndCloseButtonClickListener(() -> {

            try {
                saveable.save();
                SavedNotification.show();
                close();
            } catch (final ValidationFailedException e) {
                ErrorNotification.show(getTranslation("Validation Failed"), e.getMessage());
            }
        });

        this.headerHLayout.setMargin(true);
        this.headerHLayout.add(this.saveButtonsComponent);

        add(this.headerHLayout);
        add(saveable);

        setCloseOnOutsideClick(false);
        setSizeFull();
    }

    public <T extends Component & Saveable> SaveableDialog(T saveable, String headerText) {
        this(saveable);
        addHeader(headerText);
    }

    public void setOnCloseRunnable(Runnable onCloseRunnable) {
        this.onCloseRunnable = onCloseRunnable;
    }

    public SaveButtonsComponent getSaveButtonsComponent() {
        return this.saveButtonsComponent;
    }

    public void addHeader(String headerText) {
        Span headerTextSpan = new Span();
        headerTextSpan.setText(headerText);
        headerTextSpan.addClassName(ApmTheme.DIALOG_HEADER_TEXT);
        this.headerHLayout.add(headerTextSpan);
    }
}
