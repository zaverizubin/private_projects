package nexusglobal.wordprocessor.model.entities;

import org.hibernate.envers.Audited;

import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@MappedSuperclass
@Audited
public class BaseVersionedEntity extends BaseEntity {

    // @Version
    protected LocalDateTime version;

    public BaseVersionedEntity() {
        super();
    }

    public BaseVersionedEntity(final BaseEntity other) {
        super(other);
    }

    public BaseVersionedEntity(final Integer id) {
        super(id);
    }

    public LocalDateTime getVersion() {
        return this.version;
    }

    public void setVersion(final LocalDateTime version) {
        this.version = version;
    }
}
