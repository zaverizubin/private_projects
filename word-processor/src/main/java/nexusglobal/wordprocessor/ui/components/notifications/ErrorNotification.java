package nexusglobal.wordprocessor.ui.components.notifications;

import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.Notification.Position;
import com.vaadin.flow.component.polymertemplate.EventHandler;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.templatemodel.TemplateModel;

@Tag("error-notification")
@JsModule("./src/views/components/notifications/error-notification.js")
public class ErrorNotification extends PolymerTemplate<ErrorNotification.ErrorNotificationModel> {

    // UI Components
    @Id("titleDiv")
    private Div titleDiv;
    @Id("messageDiv")
    private Div messageDiv;
    private Notification notification;

    String innerHTML = "innerHTML";

    public interface ErrorNotificationModel extends TemplateModel {
        // Add setters and getters for template properties here.
    }

    public ErrorNotification(){

    }

    public ErrorNotification(final String title, final String message) {
        if (title == null || title.isEmpty()) {
            this.titleDiv.getElement().setProperty(this.innerHTML, "Alert");
        } else {
            this.titleDiv.getElement().setProperty(this.innerHTML, title);
        }
        this.messageDiv.getElement().setProperty(this.innerHTML, message);
    }

    public void showMessage(final String message){
        this.messageDiv.getElement().setProperty(this.innerHTML, message);
        open();
    }

    public static void show(final String message) {
        final ErrorNotification notification = new ErrorNotification(null, message);
        notification.open();
    }

    public static void show(final String title, final String message) {
        final ErrorNotification notification = new ErrorNotification(title, message);
        notification.open();
    }

    @EventHandler
    private void closeNotification() {
        this.notification.close();
    }

    public void open() {
        this.notification = new Notification(this);
        this.notification.getElement().setAttribute("theme", "notification-error");
        this.notification.setPosition(Position.MIDDLE);
        this.notification.open();
    }
}
