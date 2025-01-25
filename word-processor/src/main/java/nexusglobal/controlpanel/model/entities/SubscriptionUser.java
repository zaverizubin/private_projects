package nexusglobal.controlpanel.model.entities;

import nexusglobal.controlpanel.utils.ValidationUtils;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "subscription_users")
@Audited
public class SubscriptionUser extends BaseVersionedEntity {

    public static final String FIELD_SUBSCRIPTION = "subscription";

    @NotNull(message = "{Email cannot be empty}")
    @Email(regexp = ValidationUtils.VALID_EMAIL_REGEX, message = "Enter a valid Email Address")
    private String emailAddress;

    @ManyToOne
    private Subscription subscription;

    public SubscriptionUser() {
        super();
    }

    public SubscriptionUser(Subscription subscription) {
        super();
        this.subscription = subscription;
    }

    public SubscriptionUser(String emailAddress, Subscription subscription) {
        super();
        this.emailAddress = emailAddress;
        this.subscription = subscription;
    }

    public String getEmailAddress() {
        return this.emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public Subscription getSubscription() {
        return this.subscription;
    }

    public void setSubscription(Subscription subscription) {
        this.subscription = subscription;
    }
}
