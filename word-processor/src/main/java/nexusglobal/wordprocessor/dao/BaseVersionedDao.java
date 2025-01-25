package nexusglobal.wordprocessor.dao;


import nexusglobal.wordprocessor.model.entities.BaseVersionedEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDateTime;

public abstract class BaseVersionedDao<T extends BaseVersionedEntity> extends BaseEntityDao<T> {

    @Autowired
    protected BaseVersionedDao() {
        super();
    }

    protected BaseVersionedDao(final EntityManager em) {
        super(em);
    }

    @Override
    @Transactional(propagation = Propagation.MANDATORY)
    public void persist(final T modelObject) {
        modelObject.setVersion(LocalDateTime.now());
        this.em.persist(modelObject);
    }

    @Override
    @Transactional(propagation = Propagation.MANDATORY)
    public T merge(T modelObject) {
        modelObject.setVersion(LocalDateTime.now());
        modelObject = this.em.merge(modelObject);
        return modelObject;
    }

}