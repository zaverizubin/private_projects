package nexusglobal.wordprocessor.model;

import nexusglobal.wordprocessor.model.entities.User;

public class SystemInfo {

    private User currentAccount;

    private String os;

    private String browser;

    private String browserVersion;

    private String requestUrl;

    public SystemInfo() {
        super();
    }

    public SystemInfo(final User currentAccount, final String os, final String browser, final String browserVersion, final String requestUrl) {
        super();
        this.currentAccount = currentAccount;
        this.os = os;
        this.browser = browser;
        this.browserVersion = browserVersion;
        this.requestUrl = requestUrl;
    }

    public User getCurrentAccount() {
        return this.currentAccount;
    }

    public void setCurrentAccount(final User currentAccount) {
        this.currentAccount = currentAccount;
    }

    public String getOs() {
        return this.os;
    }

    public void setOs(final String os) {
        this.os = os;
    }

    public String getBrowser() {
        return this.browser;
    }

    public void setBrowser(final String browser) {
        this.browser = browser;
    }

    public String getBrowserVersion() {
        return this.browserVersion;
    }

    public void setBrowserVersion(final String browserVersion) {
        this.browserVersion = browserVersion;
    }

    public String getBrowserAndVersion() {
        return this.browser + " " + this.browserVersion;
    }

    public String getRequestUrl() {
        return this.requestUrl;
    }

    public void setRequestUrl(final String requestUrl) {
        this.requestUrl = requestUrl;
    }

}