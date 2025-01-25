package com.smartlist.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class GeneralRepository<T> {

    @PersistenceContext
    EntityManager entityManager;

    public void detachEntity(T entity) {
        this.entityManager.detach(entity);
    }
}
