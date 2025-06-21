package in.focalworks.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.focalworks.backend.data.entity.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

	Team findById(long id);

	Page<Team> findBy(Pageable page);

	Page<Team> findByNameLikeIgnoreCase(String name, Pageable page);

	int countByNameLikeIgnoreCase(String name);
}
