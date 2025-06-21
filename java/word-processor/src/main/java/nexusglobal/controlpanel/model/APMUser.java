package nexusglobal.controlpanel.model;

import nexusglobal.controlpanel.model.entities.Account;

public class APMUser {

    private final String firstName;

    private final String lastName;

    private final String emailAddress;

    private final String uuid;

    public APMUser(final Account account, final String uuid) {
        super();

        this.firstName = account.getFirstName();
        this.lastName = account.getLastName();
        this.emailAddress = account.getEmail();
        this.uuid = uuid;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public String getEmailAddress() {
        return this.emailAddress;
    }

    public String getUuid() {
        return this.uuid;
    }

}
