package nexusglobal.wordprocessor.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class JSONSubscription {

    private final int id;

    private final int subscriptionId;

    private final String planName;

    private final String emailAddress;

    @JsonCreator
    public JSONSubscription(@JsonProperty("id") int id,
                            @JsonProperty("subscriptionId") int subscriptionId,
                            @JsonProperty("planName") String planName,
                            @JsonProperty("emailAddress") String emailAddress) {
        super();
        this.id = id;
        this.subscriptionId = subscriptionId;
        this.planName = planName;
        this.emailAddress = emailAddress;
    }

    public int getId() {
        return this.id;
    }

    public int getSubscriptionId() {
        return this.subscriptionId;
    }

    public String getPlanName() {
        return this.planName;
    }

    public String getEmailAddress() {
        return this.emailAddress;
    }

}
