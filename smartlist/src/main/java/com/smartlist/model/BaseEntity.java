package com.smartlist.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@MappedSuperclass
public abstract class BaseEntity implements Serializable, Cloneable {

    public static final String FIELD_ID = "id";
    public static final String FIELD_VERSION = "version";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    protected Integer id;

    @Getter
    @Setter
    protected LocalDateTime version;

    @Transient
    @Getter
    @Setter
    protected boolean isDirty = false;

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


    public boolean isNew() {
        return this.id == null || this.id < 0;
    }


    @PrePersist
    void createdAt() {
        this.version = LocalDateTime.now();
    }

    @PreUpdate
    void updatedAt() {
        this.version = LocalDateTime.now();
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