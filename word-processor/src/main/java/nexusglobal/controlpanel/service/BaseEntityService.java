package nexusglobal.controlpanel.service;


import nexusglobal.controlpanel.dao.BaseEntityDao;
import nexusglobal.controlpanel.interfaces.ControlPanelEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Transactional
public abstract class BaseEntityService<T extends ControlPanelEntity, D extends BaseEntityDao<T>> {

    protected final D dao;

    protected BaseEntityService(final D dao) {
        super();
        this.dao = dao;
    }

    public Optional<T> findById(Integer id) {
        return this.dao.findById(id);
    }

    public List<T> findAll() {
        return this.dao.findAll();
    }

    @Transactional
    public void save(final T entity) {
        if (entity.isMarkedToDelete()) {
            removeEntity(entity);
        } else if (entity.getId() == null || entity.getId() < 0) {
            persistEntity(entity);
        } else {
            updateEntity(entity);
        }
    }

    @Transactional
    public T saveAndReturn(final T entity) {
        if (entity.isMarkedToDelete()) {
            removeEntity(entity);
            return null;
        } else if (entity.getId() == null || entity.getId() < 0) {
            persistEntity(entity);
            return entity;
        } else {
            return updateEntity(entity);
        }
    }

    @Transactional
    public void save(final Collection<T> entities) {
        for (final T entity : entities) {
            save(entity);
        }
    }

    @Transactional
    public void removeEntity(final T entity) {
        this.dao.remove(entity.getId());
    }

    @Transactional
    public void removeEntities(final Collection<T> entitiesToRemove) {
        for (final T entityToRemove : entitiesToRemove) {
            removeEntity(entityToRemove);
        }
    }

    @Transactional
    public void persistEntity(final T entity) {
        entity.setId(null);
        this.dao.persist(entity);
    }

    @Transactional
    public T updateEntity(final T entity) {
        return this.dao.merge(entity);
    }

    public D getDao() {
        return this.dao;
    }
}