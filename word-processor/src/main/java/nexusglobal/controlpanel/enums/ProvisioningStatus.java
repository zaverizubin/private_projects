package nexusglobal.controlpanel.enums;

public enum ProvisioningStatus{
    NA("N.A."),
    ERROR("ERROR"),
    COMPLETED("COMPLETED");

    public String getDisplayText() {
        return this.displayText;
    }

    private final String displayText;

    ProvisioningStatus(String displayText){
        this.displayText = displayText;
    }
}