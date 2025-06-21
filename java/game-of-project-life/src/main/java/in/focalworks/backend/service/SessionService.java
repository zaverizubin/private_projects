package in.focalworks.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import in.focalworks.backend.data.entity.Session;
import in.focalworks.backend.repositories.SessionRepository;

@Service
public class SessionService implements FilterableCrudService<Session> {

	private final SessionRepository sessionRepository;

	@Autowired
	public SessionService(final SessionRepository sessionRepository) {
		this.sessionRepository = sessionRepository;
	}

	@Override
	public Page<Session> findAnyMatching(final Optional<String> filter, final Pageable pageable) {
		if (filter.isPresent()) {
			final String repositoryFilter = "%" + filter.get() + "%";
			return sessionRepository.findByRoom_NameLikeIgnoreCase(repositoryFilter, pageable);
		} else {
			return find(pageable);
		}
	}

	@Override
	public long countAnyMatching(final Optional<String> filter) {
		if (filter.isPresent()) {
			final String repositoryFilter = "%" + filter.get() + "%";
			return sessionRepository.countBySessionkeyLikeIgnoreCase(repositoryFilter);
		} else {
			return count();
		}
	}

	public Page<Session> find(final Pageable pageable) {
		return sessionRepository.findBy(pageable);
	}

	@Override
	public JpaRepository<Session, Long> getRepository() {
		return sessionRepository;
	}

	@Override
	public Session createNew() {
		return new Session();
	}


}
