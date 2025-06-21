package nexusglobal.controlpanel.utils;

import com.vaadin.flow.component.UI;
import com.vaadin.flow.server.WebBrowser;
import nexusglobal.controlpanel.interfaces.Loggable;
import nexusglobal.controlpanel.model.SystemInfo;
import nexusglobal.controlpanel.model.entities.User;


public final class SystemUtils implements Loggable {

    private SystemUtils() {
        super();
    }

    public static SystemInfo getSystemInfo(final UI currentUI, final User currentUser) {

        final WebBrowser browser = currentUI != null && currentUI.getSession() != null ? UI.getCurrent().getSession().getBrowser() : null;
        String os = "";
        String browserName = "";
        if (browser != null) {

            if (browser.isAndroid()) {
                os = "Android";
            } else if (browser.isMacOSX()) {
                os = "Mac OSX";
            } else if (browser.isWindows()) {
                os = "Windows";
            } else if (browser.isLinux()) {
                os = "Linux";
            }

            if (browser.isChrome()) {
                browserName = "Google Chrome";
            } else if (browser.isFirefox()) {
                browserName = "Mozilla Firefox";
            } else if (browser.isIE()) {
                browserName = "Microsoft Internet Explorer";
            } else if (browser.isSafari()) {
                browserName = "Apple Safari";
            } else if (browser.isOpera()) {
                browserName = "Opera";
            }
        }

        final SystemInfo systemInfo = new SystemInfo();

        final String browserVersion = browser != null ? browser.getBrowserMajorVersion() + "." + browser.getBrowserMinorVersion() : "Browser Info Not Available.";

        systemInfo.setCurrentAccount(currentUser);

        systemInfo.setOs(os);
        systemInfo.setBrowser(browserName);
        systemInfo.setBrowserVersion(browserVersion);


        return systemInfo;
    }
}
