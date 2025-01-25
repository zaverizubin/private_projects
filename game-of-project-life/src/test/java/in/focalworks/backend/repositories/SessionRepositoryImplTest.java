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

import in.focalworks.backend.data.entity.Session;

@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class SessionRepositoryImplTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private SessionRepository sessionRepository;

	private Pageable createPageRequest(final int firstResult, final int maxResults) {
		return PageRequest.of(firstResult, maxResults);
	}

	private Pageable createPageRequest(final int firstResult, final int maxResults, final Direction direction,
			final String sortColumn) {
		return PageRequest.of(firstResult, maxResults, direction, sortColumn);
	}

	@Test
	public void givenSessionsThenCount() {
		// given
		// when
		final Pageable page = createPageRequest(0, 20);
		final Page<Session> sessions = sessionRepository.findBy(page);
		// then
		assertEquals(2, sessions.getContent().size());
	}

	@Test
	public void givenSessionsWhenOrderByStartDateThenCount() {
		// given
		// when
		final Pageable page = createPageRequest(0, 20, Direction.ASC, "startdate");
		final Page<Session> sessions = sessionRepository.findBy(page);
		// then
		assertEquals(2, sessions.getContent().size());
	}

	@Test
	public void givenSessionsWhenRoomNameLikeThenCount() {
		// given
		final String name = "%1";
		// when
		final Pageable page = createPageRequest(0, 20);
		final Page<Session> sessions = sessionRepository.findByRoom_NameLikeIgnoreCase(name, page);

		// then
		assertEquals(1, sessions.getContent().size());
	}

}
