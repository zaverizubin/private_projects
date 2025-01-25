package nexusglobal.wordprocessor.dao;

import nexusglobal.wordprocessor.interfaces.ControlPanelEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import java.util.Optional;

@Transactional(readOnly = true, value = "transactionManager")
public abstract class BaseEntityDao<T extends ControlPanelEntity> extends BaseDao<T> {

    @Autowired
    protected BaseEntityDao() {
        super();
    }

    protected BaseEntityDao(final EntityManager em) {
        super(em);
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void remove(final Integer entityId) {
        final Optional<T> entityToRemove = findById(entityId);
        entityToRemove.ifPresent(this::remove);
    }

    public Optional<T> findById(final Integer id) {
        return Optional.ofNullable(this.em.find(getEntityClass(), id));
    }

    public T getById(final Integer id) {
        final Optional<T> result = findById(id);
        if (!result.isPresent()) {
            throw new NoResultException("id=" + id);
        }
        return result.get();
    }

}
