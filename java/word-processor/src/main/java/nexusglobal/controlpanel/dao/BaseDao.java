package nexusglobal.controlpanel.dao;


import nexusglobal.controlpanel.interfaces.Loggable;
import nexusglobal.controlpanel.utils.QueryBuilder;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import javax.annotation.PostConstruct;
import javax.persistence.*;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.CriteriaUpdate;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.BiFunction;

public abstract class BaseDao<T> implements Loggable, Serializable {

    protected String cacheableHint = "org.hibernate.cacheable";

    @PersistenceContext(unitName = "default")
    protected EntityManager em;

    protected CriteriaBuilder cb;

    protected BaseDao() {
        super();
    }

    protected BaseDao(final EntityManager em) {
        super();

        this.em = em;
        init();
    }

    @PostConstruct
    protected void init() {
        this.cb = this.em.getCriteriaBuilder();
    }

    protected <S> List<S> find(final CriteriaQuery<S> query) {
        return this.em.createQuery(query).getResultList();
    }

    protected <S> List<S> find(final CriteriaQuery<S> query, final Integer maxResults) {
        final TypedQuery<S> typedQuery = this.em.createQuery(query);
        if (maxResults != null) {
            typedQuery.setMaxResults(maxResults);
        }
        return typedQuery.getResultList();
    }

    protected <S> Optional<S> findSingleResult(final CriteriaQuery<S> query) {
        final List<S> results = find(query);
        if (results.size() > 1) {
            throw new NonUniqueResultException();
        }
        final S result = !results.isEmpty() ? results.get(0) : null;
        return Optional.ofNullable(result);
    }

    protected <S> S getSingleResult(final CriteriaQuery<S> query) {
        final Optional<S> result = findSingleResult(query);

        return result.orElseThrow(NoResultException::new);
    }

    protected QueryBuilder<T, T> queryBuilder() {
        return new QueryBuilder<>(this.cb, getEntityClass(), getEntityClass());
    }

    protected <S> QueryBuilder<T, S> queryBuilder(final Class<S> resultClass) {
        return new QueryBuilder<>(this.cb, getEntityClass(), resultClass);
    }

    protected <S, U> QueryBuilder<U, S> queryBuilder(final Class<U> fromClass, final Class<S> resultClass) {
        return new QueryBuilder<>(this.cb, fromClass, resultClass);
    }

    protected <R> List<R> getResultsThatContainsInPredicate(final int maxIndex, final BiFunction<Integer, Integer, List<R>> biFunction) {

        final List<R> results = new ArrayList<>();
        if (maxIndex != 0) { // An empty list will thrown an error with the .in comparison

            int startingIndex = 0;
            int endingIndex = 1;
            while (endingIndex <= maxIndex) {

                endingIndex = startingIndex + 2000;
                endingIndex = Math.min(endingIndex, maxIndex);

                results.addAll(biFunction.apply(startingIndex, endingIndex));

                if (endingIndex != maxIndex) {
                    startingIndex = startingIndex + 2000;
                    startingIndex = Math.min(startingIndex, maxIndex);
                } else {
                    endingIndex++; // Increment this past maxIndex to break out of the loop
                }

            }

        }

        return results;
    }

    protected void runQueryThatContainsInPredicate(final int maxIndex, final BiConsumer<Integer, Integer> biConsumer) {

        if (maxIndex != 0) { // An empty list will thrown an error with the .in comparison

            int startingIndex = 0;
            int endingIndex = 1;
            while (endingIndex <= maxIndex) {

                endingIndex = startingIndex + 2000;
                endingIndex = Math.min(endingIndex, maxIndex);

                biConsumer.accept(startingIndex, endingIndex);

                if (endingIndex != maxIndex) {
                    startingIndex = startingIndex + 2000;
                    startingIndex = Math.min(startingIndex, maxIndex);
                } else {
                    endingIndex++; // Increment this past maxIndex to break out of the loop
                }

            }

        }

    }

    protected long count(final CriteriaQuery<Long> criteriaQuery) {
        return findSingleResult(criteriaQuery).orElse(0L);
    }

    protected CriteriaQuery<T> createQuery() {
        return this.cb.createQuery(getEntityClass());
    }

    protected <R> CriteriaQuery<R> createQuery(final Class<R> rootClass) {
        return this.cb.createQuery(rootClass);
    }

    protected void executeUpdate(final CriteriaUpdate<T> criteriaUpdate) {
        this.em.createQuery(criteriaUpdate).executeUpdate();
    }

    protected void executeDelete(final CriteriaDelete<T> criteriaDelete) {
        this.em.createQuery(criteriaDelete).executeUpdate();
    }

    protected abstract Class<T> getEntityClass();

    protected String getEntityName() {
        return getEntityClass().getCanonicalName();
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void persist(final T modelObject) {
        this.em.persist(modelObject);
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public T merge(T modelObject) {
        modelObject = this.em.merge(modelObject);
        return modelObject;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void remove(final T entityToRemove) {
        this.em.remove(entityToRemove);
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void detach(final T entity) {
        this.em.detach(entity);
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void flush() {
        this.em.flush();
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void clear() {
        this.em.clear();
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void flushAndClear() {
        flush();
        clear();
    }

    public void markTransactionRollbackOnly() {
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    }

    public List<T> findAll() {
        return find(queryBuilder().build());
    }

    public CriteriaBuilder getCriteriaBuilder() {
        return this.cb;
    }


}
