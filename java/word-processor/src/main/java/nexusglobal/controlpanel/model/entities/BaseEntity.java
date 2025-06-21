package nexusglobal.controlpanel.model.entities;


import nexusglobal.controlpanel.interfaces.ControlPanelEntity;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.io.Serializable;

@MappedSuperclass
@Audited
public abstract class BaseEntity implements ControlPanelEntity, Serializable, Cloneable {

    public static final String FIELD_ID = "id";
    public static final String FIELD_VERSION = "version";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Integer id;
    @Transient
    protected boolean isDirty = false;
    @Transient
    private boolean markToDelete;

    protected BaseEntity() {
        super();
    }

    protected BaseEntity(final Integer id) {
        super();
        this.id = id;
    }

    protected BaseEntity(final BaseEntity other) {
        super();
        this.id = other.id;
    }

    @Override
    public Integer getId() {
        return this.id;
    }

    @Override
    public void setId(final Integer id) {
        this.id = id;
    }

    @Override
    public boolean isMarkedToDelete() {
        return this.markToDelete;
    }

    @Override
    public void markToDelete() {
        // Don't mark it if it hasn't been persisted yet
        if (this.id != null && this.id > 0) {
            this.markToDelete = true;
        }
    }

    public boolean isNew() {
        return this.id == null || this.id < 0;
    }

    public void removeMarkToDelete() {
        this.markToDelete = false;
    }

    public boolean isDirty() {
        return this.isDirty;
    }

    public void setDirty(boolean dirty) {
        this.isDirty = dirty;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + (this.id == null ? 0 : this.id.hashCode());
        return result;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final BaseEntity other = (BaseEntity) obj;
        return (this.id == null ? other.id == null : this.id.equals(other.id));
    }


}