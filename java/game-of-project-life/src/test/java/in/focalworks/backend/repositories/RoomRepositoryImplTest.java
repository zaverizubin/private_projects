package in.focalworks.backend.repositories;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.test.context.junit4.SpringRunner;

import in.focalworks.backend.data.entity.Room;

@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class RoomRepositoryImplTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private RoomRepository roomRepository;

	private Pageable createPageRequest(final int firstResult, final int maxResults) {
		return PageRequest.of(firstResult, maxResults);
	}

	private Pageable createPageRequest(final int firstResult, final int maxResults, final Direction direction,
			final String sortColumn) {
		return PageRequest.of(firstResult, maxResults, direction, sortColumn);
	}

	@Test
	public void givenRoomsThenCount() {
		// given
		// when
		final Pageable page = createPageRequest(0, 20);
		final Page<Room> rooms = roomRepository.findBy(page);
		// then
		assertEquals(2, rooms.getContent().size());
	}

	@Test
	public void givenRoomsWhenOrderByNameThenCount() {
		// given
		// when
		final Pageable page = createPageRequest(0, 20, Direction.ASC, "name");
		final Page<Room> rooms = roomRepository.findBySessions_Count(1, page);
		// then
		assertEquals(2, rooms.getContent().size());
	}

	@Test
	public void givenRoomsWhenNameLikeThenCount() {
		// given
		final String name = "ro%";
		// when
		final Pageable page = createPageRequest(0, 20);
		final Page<Room> rooms = roomRepository.findByNameLikeIgnoreCase(name, page);

		// then
		assertEquals(2, rooms.getContent().size());
	}

}
