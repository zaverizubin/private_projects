package nexusglobal.controlpanel.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import nexusglobal.controlpanel.enums.ProvisioningStatus;
import nexusglobal.controlpanel.utils.ValidationUtils;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@Entity
@Table(name = "account")
@Audited
public class Account extends BaseVersionedEntity {

    public static final String FIELD_ACCOUNT_NUMBER = "accountNumber";
    public static final String FIELD_FIRST_NAME = "firstName";
    public static final String FIELD_LAST_NAME = "lastName";
    public static final String FIELD_EMAIL_ADDRESS = "email";
    public static final String FIELD_COMPANY = "company";
    public static final String FIELD_ACCOUNT_MANAGER = "accountManager";
    public static final String FIELD_EXPIRY_DATE = "expiryDate";
    public static final String FIELD_SERVER = "server";
    public static final String FIELD_ON_PREM = "onPrem";
    public static final String FIELD_SCHEMA_NAME = "schemaName";
    public static final String FIELD_CONCURRENT_USER_SESSIONS = "concurrentUserSessions";

    @Transient
    private final Random random = new Random();

    @Column(unique = true)
    private String accountNumber;

    private String firstName;

    private String lastName;

    @NotNull(message = "{Email cannot be empty}")
    @Email(regexp = ValidationUtils.VALID_EMAIL_REGEX, message = "Enter a valid Email Address")
    private String email;

    @NotNull(message = "{Company cannot be empty}")
    private String company;

    private String accountManager;

    private LocalDate expiryDate;

    @NotNull(message = "{Server name cannot be empty}")
    private String server;

    private Boolean onPrem;

    @Column
    private String schemaName;

    private Integer concurrentUserSessions;

    @Enumerated(EnumType.STRING)
    private ProvisioningStatus provisioningStatus;

    @Column
    private String provisioningStatusMessage;

    // Chargebee fields
    private String customerId;


    @OneToMany(mappedBy = "account", fetch = FetchType.EAGER, cascade = {CascadeType.ALL}, orphanRemoval = true)
    @JsonIgnore
    private Set<Subscription> subscriptions = new HashSet<>();


    @OneToMany(mappedBy = "account", fetch = FetchType.EAGER, cascade = {CascadeType.ALL}, orphanRemoval = true)
    @JsonIgnore
    private Set<OnPremSchema> onPremSchemas = new HashSet<>();



    public Account() {
        super();
        this.accountNumber = getRandomAccountNumber();
        this.onPrem = false;
        this.expiryDate = LocalDate.now();
    }

    public Account(final String firstName, String lastName, String email, String company, String schemaName, String accountManager, String customerId) {
        super();

        this.accountNumber = getRandomAccountNumber();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.company = company;
        this.accountManager = accountManager;
        this.schemaName = schemaName;
        this.customerId = customerId;
        this.onPrem = false;
        this.expiryDate = LocalDate.now();
    }

    private String getRandomAccountNumber() {

        final int randomInt = 100000000 + this.random.nextInt(900000000);
        return Integer.toString(randomInt);
    }

    public String getAccountNumber() {
        return this.accountNumber;
    }

    public void setAccountNumber(final String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(final String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(final String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    public String getCompany() {
        return this.company;
    }

    public void setCompany(final String company) {
        this.company = company;
    }

    public String getAccountManager() {
        return this.accountManager;
    }

    public void setAccountManager(final String accountManager) {
        this.accountManager = accountManager;
    }

    public Double getConcurrentUserSessions() {
        return this.concurrentUserSessions != null ? this.concurrentUserSessions.doubleValue() : null;
    }

    public void setConcurrentUserSessions(Double count) {
        if (count != null) {
            this.concurrentUserSessions = count.intValue();
        }
    }

    public Integer getNumberOfSubscriptions() {
        return this.subscriptions.size();
    }

    public LocalDate getExpiryDate() {
        return this.expiryDate == null ? LocalDate.now() : this.expiryDate;
    }

    public void setExpiryDate(final LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public ProvisioningStatus getProvisioningStatus() {
        return this.provisioningStatus;
    }

    public void setProvisioningStatus(ProvisioningStatus provisioningStatus) {
        this.provisioningStatus = provisioningStatus;
    }

    public String getProvisioningStatusMessage() {
        return this.provisioningStatusMessage;
    }

    public void setProvisioningStatusMessage(String provisioningStatusMessage) {
        this.provisioningStatusMessage = provisioningStatusMessage;
    }


    public String getServer() {
        return this.server;
    }

    public void setServer(final String server) {
        this.server = server;
    }

    public String getSchemaName() {
        return this.schemaName;
    }

    public void setSchemaName(final String schemaName) {
        this.schemaName = schemaName;
    }

    public Boolean getOnPrem() {
        return this.onPrem;
    }

    public void setOnPrem(Boolean onPrem) {
        this.onPrem = onPrem;
    }

    public Set<Subscription> getSubscriptions() {
        return this.subscriptions;
    }

    public void setSubscriptions(final Set<Subscription> subscriptions) {
        this.subscriptions = subscriptions;
    }

    public Set<OnPremSchema> getOnPremSchemas() {
        return this.onPremSchemas;
    }

    public void setOnPremSchemas(Set<OnPremSchema> onPremSchemas) {
        this.onPremSchemas = onPremSchemas;
    }

    public String getCustomerId() {
        return this.customerId;
    }

    public void setCustomerId(final String customerId) {
        this.customerId = customerId;
    }

}
