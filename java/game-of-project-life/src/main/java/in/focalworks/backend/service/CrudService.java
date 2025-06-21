package in.focalworks.backend.service;

import javax.persistence.EntityNotFoundException;

import org.springframework.data.jpa.repository.JpaRepository;

import in.focalworks.backend.data.entity.AbstractEntity;
import in.focalworks.backend.data.entity.User;

public interface CrudService<T extends AbstractEntity> {

	JpaRepository<T, Long> getRepository();

	default T save(final User currentUser, final T entity) {
		return getRepository().saveAndFlush(entity);
	}

	default void delete(final User currentUser, final T entity) {
		if (entity == null) {
			throw new EntityNotFoundException();
		}
		getRepository().delete(entity);
	}

	default void delete(final User currentUser, final long id) {
		delete(currentUser, load(id));
	}

	default long count() {
		return getRepository().count();
	}

	default T load(final long id) {
		final T entity = getRepository().findById(id).orElse(null);
		if (entity == null) {
			throw new EntityNotFoundException();
		}
		return entity;
	}

	T createNew();
}
