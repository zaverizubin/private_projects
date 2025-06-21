package nexusglobal.controlpanel.model.entities;

import nexusglobal.controlpanel.enums.SubscriptionPlan;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "subscriptions")
@Audited
public class Subscription extends BaseVersionedEntity {

    private String planName;

    @ColumnDefault("0")
    private boolean isTrial;

    private String subscriptionId;

    @ColumnDefault("0")
    private boolean unlimitedUsers;

    private LocalDateTime subscriptionStartedTimestamp;

    @ManyToOne
    private Account account;

    @OneToMany(mappedBy = SubscriptionUser.FIELD_SUBSCRIPTION, fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private final Set<SubscriptionUser> subscriptionUsers = new HashSet<>();

    public Subscription() {
        super();
    }

    public Subscription(Account account, SubscriptionPlan subscriptionPlan) {
        super();
        this.account = account;
        this.planName = subscriptionPlan.name();
        this.unlimitedUsers = false;
    }

    public SubscriptionPlan getPlanName() {
        return SubscriptionPlan.getByName(this.planName);
    }

    public void setPlanName(SubscriptionPlan planName) {
        this.planName = planName.toString();
    }

    public boolean isTrial() {
        return this.isTrial;
    }

    public void setTrial(boolean isTrial) {
        this.isTrial = isTrial;
    }

    public String getSubscriptionId() {
        return this.subscriptionId;
    }

    public void setSubscriptionId(String subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    public boolean isUnlimitedUsers() {
        return this.unlimitedUsers;
    }

    public void setUnlimitedUsers(boolean unlimitedUsers) {
        this.unlimitedUsers = unlimitedUsers;
    }

    public LocalDateTime getSubscriptionStartedTimestamp() {
        return this.subscriptionStartedTimestamp;
    }

    public void setSubscriptionStartedTimestamp(LocalDateTime subscriptionStartedTimestamp) {
        this.subscriptionStartedTimestamp = subscriptionStartedTimestamp;
    }

    public Account getAccount() {
        return this.account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }


    public Set<SubscriptionUser> getSubscriptionUsers() {
        return this.subscriptionUsers;
    }

}
