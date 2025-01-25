package nexusglobal.wordprocessor.model.entities;

import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "on_prem_schema")
@Audited
public class OnPremSchema extends BaseVersionedEntity {

    @ManyToOne
    private Account account;

    private String schemaName;

    public OnPremSchema() {
        super();
    }

    public OnPremSchema(Account account) {
        super();
        this.account = account;
    }

    public OnPremSchema(Account account, String schema) {
        super();
        this.account = account;
        this.schemaName = schema;
    }

    public Account getAccount() {
        return this.account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public String getSchemaName() {
        return this.schemaName;
    }

    public void setSchemaName(String schemaName) {
        this.schemaName = schemaName;
    }

}
