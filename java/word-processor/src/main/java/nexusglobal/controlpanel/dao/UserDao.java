package nexusglobal.controlpanel.dao;


import nexusglobal.controlpanel.model.entities.User;
import nexusglobal.controlpanel.model.entities.User_;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.Optional;

@Repository
public class UserDao extends BaseVersionedDao<User> {

    protected UserDao() {
        super();
    }

    public UserDao(final EntityManager em) {
        super(em);
    }

    @Override
    protected Class<User> getEntityClass() {
        return User.class;
    }

    public Optional<User> findByUsername(final String userName) {
        final CriteriaQuery<User> cq = this.cb.createQuery(User.class);
        final Root<User> root = cq.from(User.class);

        cq.where(this.cb.equal(root.get(User_.userName), userName));
        return findSingleResult(cq);
    }

}