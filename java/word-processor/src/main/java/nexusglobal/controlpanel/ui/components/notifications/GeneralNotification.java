package nexusglobal.controlpanel.ui.components.notifications;

import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.Notification.Position;
import com.vaadin.flow.component.polymertemplate.EventHandler;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.templatemodel.TemplateModel;

@Tag("general-notification")
@JsModule("./src/views/components/notifications/general-notification.js")
public class GeneralNotification extends PolymerTemplate<GeneralNotification.GeneralNotificationModel> {

    private final Notification notification = new Notification(this);
    @Id("titleDiv")
    private Div titleDiv;
    @Id("messageDiv")
    private Div messageDiv;
    @Id("okButton")
    private Button okButton;

    String innerHTML = "innerHTML";
    /**
     * This model binds properties between SavedNotification and saved-notification.html
     */
    public interface GeneralNotificationModel extends TemplateModel {
        void setTitle(String title);
    }

    public GeneralNotification() {

    }

    public GeneralNotification(final String message) {
        super();
        getModel().setTitle("Alert");
        this.messageDiv.getElement().setProperty(this.innerHTML, message);
    }

    public void showMessage(final String message){
        this.messageDiv.getElement().setProperty(this.innerHTML, message);
        setAttributes();
        open();
    }

    public static void show(final String title, final String message) {
        final GeneralNotification generalNotification = buildNotification(message);
        generalNotification.getModel().setTitle(title);
    }

    public static void show(final String message) {
        buildNotification(message);
    }

    private static GeneralNotification buildNotification(final String message) {
        final GeneralNotification generalNotification = new GeneralNotification(message);
        generalNotification.setAttributes();
        generalNotification.open();
        return generalNotification;
    }

    private void setAttributes() {
        this.notification.getElement().setAttribute("theme", "notification-general");
        this.notification.setPosition(Position.MIDDLE);
        this.okButton.setText("OK");
        this.okButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
    }

    private void open() {
        this.notification.open();
    }

    @EventHandler
    private void closeNotification() {
        this.notification.close();
    }
}
