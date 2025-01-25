package nexusglobal.controlpanel.model.entities;

import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import java.util.Date;

@Entity
@Audited
public class SystemMessage extends BaseEntity {

    private String description;

    private Date endDate;

    private Date reminderDate;

    public String getDescription() {
        return this.description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public Date getEndDate() {
        return this.endDate;
    }

    public void setEndDate(final Date endDate) {
        this.endDate = endDate;
    }

    public Date getReminderDate() {
        return this.reminderDate;
    }

    public void setReminderDate(final Date reminderDate) {
        this.reminderDate = reminderDate;
    }

}
