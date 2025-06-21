package in.focalworks.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import in.focalworks.backend.data.entity.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
	Page<Room> findBy(Pageable page);

	Page<Room> findByNameLikeIgnoreCase(String name, Pageable page);

	@Query(value = "SELECT R.Id, R.Name, R.Facilitator, R.Scorer, R.CreatedOn FROM Room R INNER JOIN Session "
			+ "ON Session.room = R.Id Group by R.Id, R.Name, r.Facilitator, R.Scorer having Count(Session.sessionkey) = ?1", nativeQuery = true)
	Page<Room> findBySessions_Count(int count, Pageable page);

	int countByNameLikeIgnoreCase(String name);
}
