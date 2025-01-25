package in.focalworks.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.focalworks.backend.data.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	User findById(long id);

	Page<User> findBy(Pageable page);

	Page<User> findDistinctUserByUsernameLikeAndRoles_NameNotIgnoreCase(String username,
			String rolenameNot,
			Pageable page);

	Page<User> findDistinctUserByRoles_NameNotIgnoreCase(String name, Pageable page);

	int countByUsernameLikeIgnoreCase(String username);
}
