package in.focalworks.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import in.focalworks.backend.data.entity.User;
import in.focalworks.backend.repositories.UserRepository;

@Service
public class UserService implements FilterableCrudService<User> {

	private final UserRepository userRepository;

	@Autowired
	public UserService(final UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public Page<User> findAnyMatching(final Optional<String> filter, final Pageable pageable) {
		if (filter.isPresent()) {
			final String repositoryFilter = "%" + filter.get() + "%";
			return userRepository.findDistinctUserByUsernameLikeAndRoles_NameNotIgnoreCase(repositoryFilter, "admin",
					pageable);
		} else {
			return find(pageable);
		}
	}

	@Override
	public long countAnyMatching(final Optional<String> filter) {
		if (filter.isPresent()) {
			final String repositoryFilter = "%" + filter.get() + "%";
			return userRepository.countByUsernameLikeIgnoreCase(repositoryFilter);
		} else {
			return count();
		}
	}

	public Page<User> find(final Pageable pageable) {
		return userRepository.findBy(pageable);
	}

	@Override
	public JpaRepository<User, Long> getRepository() {
		return userRepository;
	}

	@Override
	public User createNew() {
		return new User();
	}


}
