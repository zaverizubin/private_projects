package nexusglobal.controlpanel.enums;

public enum Applications {
    HOME("APM Optimizer Suite"),
    DATA_OPTIMIZER("Data Optimizer"),
    INVESTIGATION_OPTIMIZER("Investigation Optimizer"),
    PLANNING_OPTIMIZER("Planning Optimizer"),
    STRATEGY_OPTIMIZER("Strategy Optimizer");

    String applicationName;

    Applications(final String applicationName) {
        this.applicationName = applicationName;
    }

    public String getApplicationName() {
        return this.applicationName;
    }
}
