package in.focalworks.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.focalworks.backend.data.entity.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
	Page<Session> findBy(Pageable page);

	Page<Session> findByRoom_NameLikeIgnoreCase(String name, Pageable page);

	int countBySessionkeyLikeIgnoreCase(String sessionkey);
}
