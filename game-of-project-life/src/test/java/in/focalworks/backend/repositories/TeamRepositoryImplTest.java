package in.focalworks.backend.repositories;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

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

import in.focalworks.backend.data.entity.Team;

@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class TeamRepositoryImplTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private TeamRepository teamRepository;

	private Pageable createPageRequest(final int firstResult, final int maxResults) {
		return PageRequest.of(firstResult, maxResults);
	}

	private Pageable createPageRequest(final int firstResult, final int maxResults, final Direction direction,
			final String sortColumn) {
		return PageRequest.of(firstResult, maxResults, direction, sortColumn);
	}

	@Test
	public void givenTeamsThenCount() {
		// given
		// when
		final Pageable page = createPageRequest(0, 20);
		final Page<Team> teams = teamRepository.findBy(page);
		// then
		assertEquals(2, teams.getContent().size());
	}

	@Test
	public void givenTeamsWhenOrderByEnabledThenCount() {
		// given
		// when
		final Pageable page = createPageRequest(0, 20, Direction.ASC, "enabled");
		final Page<Team> teams = teamRepository.findBy(page);
		// then
		assertTrue(teams.getContent().get(0).getEnabled());
		assertEquals(2, teams.getContent().size());
	}

	@Test
	public void givenTeamsWhenNameLikeThenCount() {
		// given
		final String name = "te%";
		// when
		final Pageable page = createPageRequest(0, 20);
		final Page<Team> teams = teamRepository.findByNameLikeIgnoreCase(name, page);

		// then
		assertEquals(2, teams.getContent().size());
	}

}
