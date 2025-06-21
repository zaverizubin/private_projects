package nexusglobal.controlpanel.enums;

import java.util.Arrays;
import java.util.List;

public enum SubscriptionPlan {
    HOME_BUSINESS(0.00),
    IO_INDIVIDUAL(1.99),
    IO_BUSINESS(19.99),
    DO_INDIVIDUAL(1.99),
    DO_BUSINESS(19.99),
    PO_INDIVIDUAL(1.99),
    PO_BUSINESS(19.99),
    PO_ENTERPRISE(0.00),
    SO_INDIVIDUAL(1.99),
    SO_BUSINESS(19.99),
    BO_INDIVIDUAL(1.99),
    BO_BUSINESS(19.99);;

    private final double costPerUser;

    SubscriptionPlan(final double costPerUser) {
        this.costPerUser = costPerUser;
    }

    public static SubscriptionPlan getByName(final String planName) {
        if ("home-business".equalsIgnoreCase(planName)) {
            return HOME_BUSINESS;
        } else if ("io-individual".equalsIgnoreCase(planName)) {
            return IO_INDIVIDUAL;
        } else if ("io-business".equalsIgnoreCase(planName)) {
            return IO_BUSINESS;
        } else if ("do-individual".equalsIgnoreCase(planName)) {
            return DO_INDIVIDUAL;
        } else if ("do-business".equalsIgnoreCase(planName)) {
            return DO_BUSINESS;
        } else if ("po-individual".equalsIgnoreCase(planName)) {
            return PO_INDIVIDUAL;
        } else if ("po-business".equalsIgnoreCase(planName)) {
            return PO_BUSINESS;
        } else if ("po-enterprise".equalsIgnoreCase(planName)) {
            return PO_ENTERPRISE;
        } else if ("so-individual".equalsIgnoreCase(planName)) {
            return SO_INDIVIDUAL;
        } else if ("so-business".equalsIgnoreCase(planName)) {
            return SO_BUSINESS;
        } else if ("bo-individual".equalsIgnoreCase(planName)) {
            return BO_INDIVIDUAL;
        } else if ("bo-business".equalsIgnoreCase(planName)) {
            return BO_BUSINESS;
        } else {
            return HOME_BUSINESS;
        }
    }

    public static List<SubscriptionPlan> getBusinessSubscriptions() {
        return Arrays.asList(IO_BUSINESS, PO_BUSINESS, DO_BUSINESS, SO_BUSINESS, BO_BUSINESS);
    }

    public static List<SubscriptionPlan> getIndividualSubscriptions() {
        return Arrays.asList(IO_INDIVIDUAL, PO_INDIVIDUAL, DO_INDIVIDUAL, SO_INDIVIDUAL, BO_INDIVIDUAL);
    }

    public double getCostPerUser() {
        return this.costPerUser;
    }

    public boolean isIndividualPlan() {
        return this == IO_INDIVIDUAL || this == DO_INDIVIDUAL || this == PO_INDIVIDUAL
                || this == SO_INDIVIDUAL || this == BO_INDIVIDUAL;
    }

    @Override
    public String toString() {
        switch (this) {
            case HOME_BUSINESS:
                return "home-business";
            case IO_INDIVIDUAL:
                return "io-individual";
            case IO_BUSINESS:
                return "io-business";
            case DO_INDIVIDUAL:
                return "do-individual";
            case DO_BUSINESS:
                return "do-business";
            case PO_INDIVIDUAL:
                return "po-individual";
            case PO_BUSINESS:
                return "po-business";
            case PO_ENTERPRISE:
                return "po-enterprise";
            case SO_INDIVIDUAL:
                return "so-individual";
            case SO_BUSINESS:
                return "so-business";
            case BO_INDIVIDUAL:
                return "bo-individual";
            case BO_BUSINESS:
                return "bo-business";
            default:
                return "";
        }
    }
}
