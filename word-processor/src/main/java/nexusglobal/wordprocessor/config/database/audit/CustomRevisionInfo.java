package nexusglobal.wordprocessor.config.database.audit;

import org.hibernate.envers.DefaultTrackingModifiedEntitiesRevisionEntity;
import org.hibernate.envers.RevisionEntity;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@RevisionEntity
@Table(name = "apm_rev_info")
public class CustomRevisionInfo extends DefaultTrackingModifiedEntitiesRevisionEntity {

    public static final String USER_NAME = "userName";

    private String userName;

    public String getUserName() {
        return this.userName;
    }

    public void setUserName(final String userName) {
        this.userName = userName;
    }
}
