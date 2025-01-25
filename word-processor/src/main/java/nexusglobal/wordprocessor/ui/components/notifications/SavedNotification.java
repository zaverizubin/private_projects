package nexusglobal.wordprocessor.ui.components.notifications;

import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.Notification.Position;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.templatemodel.TemplateModel;

@Tag("saved-notification")
@JsModule("./src/views/components/notifications/saved-notification.js")
public class SavedNotification extends PolymerTemplate<SavedNotification.SavedNotificationModel> {

    public interface SavedNotificationModel extends TemplateModel {
        void setTitle(String title);
    }

    public SavedNotification() {
        super();
        getModel().setTitle("Saved");
    }

    public SavedNotification(final String title) {
        super();
        getModel().setTitle(title);
    }

    public static void show(final String title) {
        final SavedNotification notification = new SavedNotification(title);
        notification.open();
    }


    public static void show() {
        final SavedNotification notification = new SavedNotification();
        notification.open();
    }

    public void open() {
        Notification notification = new Notification(this);
        notification.getElement().setAttribute("theme", "notification-saved");
        notification.setPosition(Position.TOP_STRETCH);
        notification.setDuration(3000);
        notification.open();
    }
}
