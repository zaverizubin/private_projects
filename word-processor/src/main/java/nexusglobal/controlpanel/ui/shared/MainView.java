package nexusglobal.controlpanel.ui.shared;

import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.page.Push;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.RoutePrefix;
import com.vaadin.flow.router.RouterLayout;
import com.vaadin.flow.server.ErrorEvent;
import com.vaadin.flow.server.VaadinSession;
import com.vaadin.flow.templatemodel.TemplateModel;
import nexusglobal.controlpanel.interfaces.Loggable;
import nexusglobal.controlpanel.model.SystemInfo;
import nexusglobal.controlpanel.model.entities.User;
import nexusglobal.controlpanel.utils.SystemUtils;

import java.time.LocalDateTime;

@Push
@RoutePrefix("")
@Tag("main-view")
@JsModule("./src/views/shared/main-view.js")
public class MainView extends PolymerTemplate<MainView.MainViewModel> implements RouterLayout, Loggable, BeforeEnterObserver {

    //Autowired


    // Global Variables

    public interface MainViewModel extends TemplateModel {
        // Add setters and getters for template properties here.
    }

    protected MainView() {
        super();
        setupGlobalErrorHandler();
    }

    private void setupGlobalErrorHandler() {
        VaadinSession.getCurrent().setErrorHandler(event -> {
            final String errorMessage = getSystemError(event);
            // This error doesn't seem to cause any problems so don't show a message for it. It is only happening on Work Pack view and it loads fine
            // after closing message. Maybe we can revisit this if it keeps happening in other areas.
            if (!errorMessage.toLowerCase().contains("Broken Pipe".toLowerCase())) {
                //do nothing
            }
        });
    }

    private String getSystemError(final ErrorEvent event) {

        String doubleNewLine = "<br/><br/>";
        String singleNewLine = "<br/>";

        final StringBuilder cause = new StringBuilder();
        final SystemInfo sysInfo = SystemUtils.getSystemInfo(UI.getCurrent(), new User());
        cause.append("UserName: ").append(sysInfo.getCurrentAccount() == null ? "anonymous" : sysInfo.getCurrentAccount().getUserName()).append(doubleNewLine);
        cause.append("Browser: ").append(sysInfo.getBrowser()).append(" ").append(sysInfo.getBrowserVersion()).append(doubleNewLine);
        cause.append("Operating System: ").append(sysInfo.getOs()).append(doubleNewLine);
        cause.append("Request URL: ").append(sysInfo.getRequestUrl()).append(doubleNewLine);

        for (Throwable t = event.getThrowable(); t != null; t = t.getCause()) {
            if (null != t.getMessage()) {
                cause.append("Error: ").append(t.getMessage()).append(doubleNewLine);
            }
            if (null != t.getCause()) {
                cause.append("Cause: ").append(t.getCause()).append(singleNewLine);
            }

            final StackTraceElement[] st = t.getStackTrace();
            for (int i = 0; i < 11; i++) {
                cause.append(st[i].toString()).append(singleNewLine);
            }
        }
        logger().error("Unexpected Error", event.getThrowable());
        cause.append(singleNewLine).append("Timestamp: ").append(LocalDateTime.now());

        return cause.toString();
    }

    @Override
    public void beforeEnter(final BeforeEnterEvent event) {

    }


}
